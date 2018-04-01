//array to store all the block objects in the mine_field container
var array_of_blocks = [];
var number_of_bombs = 0; //ten bombs
var bomb_limit = 10;
var number_of_flagged_blocks = 0;
var block_bombs = [];
var seconds = 120;
var dimension = 9;

//field generation function
function generate_field() {
	//array of block types, coordinate variables, and temp_coordinates object
	var block_types = ["empty", "bomb"];
	var index_x = 0, index_y = 0;
	var temp_coordinates = { "x": 0, "y": 0 };
	var temp_block_type = "";

	//generate 81 blocks (9 x 9 grid)
	for (var i = 1; i < dimension+1; i++) {
		//set temporary block coordinates (to be overwritten every iteration of block creation loop)
		array_of_blocks[i] = {};
		for (var j = 1; j < dimension+1; j++) {
			temp_coordinates['x'] = index_x + 1;
			temp_coordinates['y'] = index_y + 1;
			//set temporary block type (will need some kind of algorithm to limit number of bombs
			//and make sure they are evenly spread throughout the field)
			// temp_block_type = block_types[Math.floor(Math.random() * block_types.length)];
			temp_block_type = "empty";
			//reference to the mine_field container
			var mine_field = $('.mine_field');
			//creating a new block element
			var new_block_div = $('<div>');

			//creating a new block object with default block_state and random block_type values
			var new_block_object = {
				block_state: "not_clicked",
				block_type: temp_block_type,
				block_coordinate_x: temp_coordinates['x'],
				block_coordinate_y: temp_coordinates['y']
			};

			//push new blocks object to array
			array_of_blocks[i][j] = new_block_object;

			//set data-state, data-type, class & id attributes, and background image of the new block element
			new_block_div
				.data('state', new_block_object.block_state)
				.attr('type', new_block_object.block_type)
				.attr('id', `${temp_coordinates['x']}` + "-" + `${temp_coordinates['y']}`)
				.addClass('block')
				.css('background-image', `url(assets/images/${new_block_object.block_state}.png)`);

			//and append the new block element to the mine_field container
			mine_field.append(new_block_div);

			//increment index_x
			index_x++;

			//unless index_x divided by 9 has a remainder of 0 (end of row)
			if (index_x % 9 === 0) {
				//then reset index_x and increment index_y (new row)
				index_x = 0;
				index_y++;
			}
		}
	}

	plantBombs(array_of_blocks, number_of_bombs, bomb_limit);

	//testing purposes
	// console.log(array_of_blocks);
	// console.log(block_bombs);
}

function getRandomNumber(max) {
	var num = Math.floor((Math.random() * 1000) + 1) % max;
	return (num === 0) ? getRandomNumber(max) : num; 
}

function plantBombs(array, bombsPlanted, limit) {

 	var index_x, index_y;

 	while (bombsPlanted <= limit) {
 		index_x = getRandomNumber(9);
		index_y = getRandomNumber(9);
		var temp_obj = array[index_x][index_y];
		if (temp_obj.block_type !== "bomb") {
			temp_obj['block_type'] = "bomb";
			temp_obj['block_coordinate_x'] = index_x;
			temp_obj['block_coordinate_y'] = index_y;
			//search for specific coordinates
			$('#'+index_x + '-' + index_y).attr('type',temp_obj.block_type);
			array[index_x][index_y] = temp_obj;
			block_bombs[index_x] = {};
			block_bombs[index_x][index_y] = temp_obj;
			bombsPlanted++;
		}
 	}
}

function startGameTimer() {
	interval = setTimeout(startGameTimer, 1000);
	seconds--;

	console.log("Time Remaining: " + fancyTimeFormat(seconds));

	if (seconds === 0) {
		clearTimeout(interval);
		console.log("Game Over!");
	}
}

function fancyTimeFormat(time) {
	// Hours, minutes and seconds
	var hrs = ~~(time / 3600);
	var mins = ~~((time % 3600) / 60);
	var secs = time % 60;
	// Output like "1:01" or "4:03:59" or "123:03:59"
	var ret = "";

	if (hrs > 0) {
		ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
	}

	ret += "" + mins + ":" + (secs < 10 ? "0" : "");
	ret += "" + secs;

	return ret;
}

//when a div with the class 'block' is clicked on
$(document).ready(function () {
	$('body').on('mousedown', '.block', function (event) {
		console.log("block clicked");

		switch (event.which) {
			case 1:
				//if it was a left click and the clicked block's data-state attribute is 'not_clicked'
				if ($(this).data('state') === "not_clicked")
					//set its data-state attribute to 'clicked' and change the background image of the block
					$(this)
						.data('state', 'clicked')
						.css('background-image', 'url(assets/images/clicked.png)');

				//determine if we clicked block was bomb
				//or if we should perform the empty block crawl
				//example below:
				if ($(this).data('type') === "bomb") {
					console.log("a bomb block was clicked!! - perform_bomb_clicked_method() " + "--- the bomb's coordinates were " + $(this).attr('id'));
				} else if ($(this).data('type') === "empty") {
					console.log("an empty block was clicked - perform_the_empty_area_crawl_method() " + "--- the clicked block's coordinates were " + $(this).attr('id'));
				}
				break;
			case 2:
				//case for middle click (not used)
				console.log("your scroll wheel button has no use here");

				break;
			case 3:
				console.log("blok right lcicked");

				//if it was a right click and the clicked block's data-state attribute is 'not_clicked'
				if ($(this).data('state') === "not_clicked") {
					number_of_flagged_blocks++;

					//set its data-state attribute to 'flagged' and change the background image of the block
					$(this)
						.data('state', 'flagged')
						.css('background-image', 'url(assets/images/flagged.png)');
				}
				//if the clicked block's data-state attribute is already 'flagged'
				else if ($(this).data('state') === "flagged") {
					number_of_flagged_blocks--;

					//set its data-state attribute to 'not_clicked' and change the background image
					$(this)
						.data('state', 'not_clicked')
						.css('background-image', 'url(assets/images/not_clicked.png)');
				}

				break;
			default:
				//default case (also not used)
				console("how'd you manage to see this message? what kind of mouse is that?");

		}
	});
});