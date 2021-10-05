#include <iostream>
#include <fstream>

using namespace std;

int main()
{
	ofstream image;
	image.open("image.ppm");

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
				image << (x * y) % 255 << " " << (x * y) % 255 << " " << (x * y) % 255 << endl;
			}
		}
	}

	image.close();
	
	return 0;
}