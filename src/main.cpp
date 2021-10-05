/*
* tutorial from: https://www.youtube.com/watch?v=028GNYC32Rg
*/

#include "Image.h"

int main(int argc, char** argv) {
	Image test("test.jpg");
	test.write("new.png");
	Image copy = test;

	for (int i = 0; copy.w * copy.channels; i++) {
		copy.data[i] = 255;
	}
	copy.write("copy.png");
	Image blank(100, 100, 3);
	blank.write("blank.jpg");

	return 0;
}