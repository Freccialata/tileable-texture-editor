/*
* Tutorial from: https://www.youtube.com/watch?v=HGHbcRscFsg&t=670s
*/
#include <iostream>
#include <fstream>
#include <ctime>
#include <cstdlib>

#include <sstream>

using namespace std;

int main()
{
	ifstream image;
	ofstream newimage;

	image.open("Monument.ppm");
	newimage.open("newImage.ppm");

	// Copy over header information
	if ( image.is_open() && newimage.is_open() )
	{
		string type = "", width = "", height = "", RGB = "";
		image >> type;
		image >> width;
		image >> height;
		image >> RGB;

		newimage << type << "\n" << width << " " << height << "\n" << RGB << "\n";
		// cout << type << " " << width << " " << height << " " << RGB << "\n";
		
		string red = "", green = "", blue = "";
		int r = 0, g = 0, b = 0;
		while (!image.eof()) {
			image >> red;
			image >> green;
			image >> blue;

			stringstream redstream(red);
			stringstream greenstream(green);
			stringstream bluestream(blue);

			redstream >> r;
			greenstream >> g;
			bluestream >> b;

			if (b += 50 >= 255)
			{
				b = 255;
			}
			else
			{
				b += 50;
			}

			newimage << r << " " << g << " " << b << endl;
		}

		image.close();
		newimage.close();
	}
	else {
		return -1;
	}

	// system("pause>0");
	return 0;

	/*ofstream image;
	image.open("./src/image.ppm");

	srand(time(0));
	if (image.is_open())
	{
		// Place header info
		image << "P3\n";
		image << "250 250\n";
		image << "255\n";

		for (int y = 0; y < 250; y++)
		{
			for (int x = 0; x < 250; x++)
			{
				image << rand() % 255 << " " << rand() % 255 << " " << rand() % 255 << endl;
			}
		}
	}

	image.close();*/
}