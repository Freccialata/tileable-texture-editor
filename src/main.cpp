/*
* tutorial from: https://www.youtube.com/watch?v=ATkbOckoCZc&list=PLG5M8QIx5lkzdGkdYQeeCK__As6sI2tOY
*/
#include <iostream>
#include "Image.h"

int main(int argc, char** argv) {
	Image test("imgs/test.jpg");

	double ker[] = {
		1 / 16.0, 2 / 16.0, 1 / 16.0,
		2 / 16.0, 4 / 16.0, 2 / 16.0,
		1 / 16.0, 2 / 16.0, 1 / 16.0,
	}; // gaussian blur

	test.std_convolve_clamp_to_0(0, 3, 3, ker, 1, 1);
	test.std_convolve_clamp_to_0(1, 3, 3, ker, 1, 1);
	test.std_convolve_clamp_to_0(2, 3, 3, ker, 1, 1);

	test.write("imgs/blurred.png");

	std::cin.get(); // comment on release
	return 0;

	/*
	src\Image.cpp(202,21): error C2131: expression did not evaluate to a constant
	src\Image.cpp(202,19): message : failure was caused by a read of a variable outside its lifetime
	src\Image.cpp(202,19): message : see usage of 'this'
	*/

	/*Image test2("imgs/test2.jpg");

	Image diff = test;
	diff.diffmap(test2);
	diff.write("imgs/diffmap.png");*/

	/*test.encodeMessage("Msg");
	test.write("imgs/encodImg.png");

	char buffer[256] = { 0 };
	size_t len = 0;
	Image toDecode("imgs/encodImg.png");
	toDecode.decodeMessage(buffer, &len);

	printf("Message: %s (%zu)\n", buffer, len);*/

	/*test.colorMask(0, 0, 1);

	test.write("imgs/blue.png");*/

	/*Image gray_avg = test;
	gray_avg.grayscale_avg();
	gray_avg.write("imgs/grayavg.png");

	Image gray_lum = test;
	gray_lum.grayscale_lum();
	gray_lum.write("imgs/graylum.png");*/

	/*test.write("imgs/new.png");
	Image copy = test;

	for (int i = 0; i < copy.w * copy.channels; i++) {
		copy.data[i] = 255;
	}
	copy.write("imgs/copy.png");
	Image blank(100, 100, 3);
	blank.write("imgs/blank.jpg");*/
}