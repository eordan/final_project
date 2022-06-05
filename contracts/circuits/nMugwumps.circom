pragma circom 2.0.4;

include "../../node_modules/circomlib/circuits/comparators.circom";
include "../../node_modules/circomlib/circuits/switcher.circom";
include "range.circom"; // Template we created during second week

template oneMugwump() {

	// Public inputs
	signal input gpx; // Guess of the X coordinate
	signal input gpy; // Guess of the Y coordinate

	// Private inputs
	signal input mpx; // Mugwump position X
	signal input mpy; // Mugwump position Y

	// Intermidiate signals
	signal powerOfX;
	signal powerOfY;

	// Output signals
	signal output powerOfDistance;

	var coordinates[4] = [gpx, gpy, mpx, mpy];
	// var distances[82] = [0, 100, 141, 173, 200, 224, 245, 265, 283, 300, 316, 332, 346, 361, 374, 387, 400, 412, 424, 436, 447, 458, 469, 480, 490, 500, 510, 520, 530, 539, 548, 557, 566, 574, 583, 592, 600, 608, 616, 624, 632, 640, 648, 656, 663, 671, 678, 686, 693, 700, 707, 714, 721, 728, 734, 742, 748, 754, 762, 768, 775, 781, 787, 794, 800, 806, 812, 819, 825, 831, 837, 843, 849, 854, 860, 866, 872, 878, 883, 889, 894, 900];

    component rangeCheck[4];
	component compareValues[2];
    component switchValues[2];

	// Check if guess and position coordinates are within 0 and 9 (included)

	for(var i = 0; i < 4; i++) {
    	rangeCheck[i] = rangeProof(32);
    	rangeCheck[i].range[0] <== 0;
    	rangeCheck[i].range[1] <== 9;
    	rangeCheck[i].in <== coordinates[i];
    	assert(rangeCheck[i].out == 1);
	}

    // Find the power of distance

	for(var i = 0; i < 2; i++) {
    	compareValues[i] = LessEqThan(32);
		switchValues[i] = Switcher();
		compareValues[i].in[0] <== coordinates[i];
		compareValues[i].in[1] <== coordinates[i+2];
		switchValues[i].sel <== compareValues[i].out;
		switchValues[i].L <== coordinates[i];
		switchValues[i].R <== coordinates[i+2];
	}

	powerOfX <== (switchValues[0].outL - switchValues[0].outR) ** 2;
	powerOfY <== (switchValues[1].outL - switchValues[1].outR) ** 2;

	powerOfDistance <== powerOfX + powerOfY;
}

template nMugwumps(n) {
	
	// Public inputs
	signal input guessX; // Guess of the X coordinate
	signal input guessY; // Guess of the Y coordinate

	// Private inputs
	signal input soltnX[n]; // Mugwumps position X
	signal input soltnY[n]; // Mugwumps position Y

	// Output signals
	signal output powerOfDistance[n];

	component findMugwump[n];

	for(var i = 0; i < n; i++) {
		findMugwump[i] = oneMugwump();
		findMugwump[i].gpx <== guessX;
		findMugwump[i].gpy <== guessY;
		findMugwump[i].mpx <== soltnX[i];
		findMugwump[i].mpy <== soltnY[i];
		powerOfDistance[i] <== findMugwump[i].powerOfDistance;
	}
}

component main {public [guessX, guessY]} = nMugwumps(4);