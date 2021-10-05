/*
* tutorial from: https://www.youtube.com/watch?v=028GNYC32Rg
*/

#include "Image.h"

int main(int argc, char** argv) {
	Image test("test.jpg");

	return 0;

	/*test.colorMask(0, 0, 1);

	test.write("blue.png");*/

	/*Image gray_avg = test;
	gray_avg.grayscale_avg();
	gray_avg.write("grayavg.png");

	Image gray_lum = test;
	gray_lum.grayscale_lum();
	gray_lum.write("graylum.png");*/

	/*test.write("new.png");
	Image copy = test;

	for (int i = 0; i < copy.w * copy.channels; i++) {
		copy.data[i] = 255;
	}
	copy.write("copy.png");
	Image blank(100, 100, 3);
	blank.write("blank.jpg");*/
}