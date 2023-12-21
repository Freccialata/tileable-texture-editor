# Tileable texture editor

**The Computer Graphics and Virtual Reality Lab @ University of Tartu**

**AY 2021/2022**

Repo for Computer Graphics Project course: [wiki page](https://courses.cs.ut.ee/2021/cg-pro/fall/Main/Project-TileableTextureEditor).

## From the Uni Tartu's wiki page

**Gianluca Rubino**

#### Project goal

An editor that lets you upload a texture and generate a seamless version of it. The user can change come parameters to author the best look he wants.

![](https://courses.cs.ut.ee/2021/cg-pro/fall/Main/Project-TileableTextureEditor?action=download&upname=tiles.png)  
> Picture from [IMGonline](https://www.imgonline.com.ua/eng/make-seamless-texture.php).

#### Legend:

Crossed-out small text describe previews goals that now are changed.

##### [GitHub repository](https://github.com/Freccialata/tileable-texture-editor/tree/master)

### Milestone 1 (05.10)

<div style="text-decoration: line-through; font-size: 10px;">

*   Learn C++ (3.5h)
*   Choose the right library and IDEs to develop on (2.5h)
*   "Hello world" program with chosen platform (1h)

</div>

*   Learn C++ (4h)
*   Choose the right library and IDEs to develop on (2h)
*   "Hello world" program with chosen platform (1h)

#### Development notes

After having learnt the following concepts, I intend to develop a command line application using _Visual Studio Community_ to concentrate on the implementation of tiling algorithms.

*   C++ concepts: header files; building, linking and compiling; pointers; struct.
*   OpenGL concepts: the definition and specification; the use of _GLFW_ and _GLEW_ on a project; vertex buffers and basic rendering paradigm.

![](https://courses.cs.ut.ee/2021/cg-pro/fall/Main/Project-TileableTextureEditor?action=download&upname=triang.png)

*   Image processing on C++ concepts: input and output of images on ppm format; basic filtering; image loading and writing using [_stb_](https://github.com/nothings/stb) library.

![](https://courses.cs.ut.ee/2021/cg-pro/fall/Main/Project-TileableTextureEditor?action=download&upname=flower_proc.png)

*   Working files uploaded on a new [GitHub repository](https://github.com/Freccialata/tileable-texture-editor/tree/master).

### Milestone 2 (19.10)

<div style="text-decoration: line-through; font-size: 10px;">

*   The program has UI to upload an image texture and preview it
*   Make sure _stb_ is enough as image processing library, otherwise find something else (2h)
*   Implement a basic tiling algorithm on a texture (5h)

</div>

### Milestone 3 (02.11)

<div style="text-decoration: line-through; font-size: 10px;">

*   Research on methods from other people to create a tileable texture automatically
    *   Do we need to create specific parameters for each type of texture or is there one â€œglobal approachâ€?
*   Create the first automatic tile generator from an image texture without user parameters
*   Make sure _stb_ is enough as image processing library, otherwise find something else (2h)
*   Implement a basic tiling algorithm on a texture (5h)

</div>

### Milestone 4 (16.11)

<div style="text-decoration: line-through; font-size: 10px;">

*   Create UI to change generation parameters
*   Experiment with more texture types

</div>

*   The program has UI to upload an image texture and preview it (4h)
*   Research how to make a tileable texture editor (3h)
*   Bonus: Start implementing tiling algorithm (1h)

#### Development notes

The program is now developed with HTML, CSS and JavaScript. A simple front-end application inside the [Electron JS](https://www.electronjs.org/) environment that gives the ability to build a cross-platform desktop app.

<div class="img imgonly">![](https://courses.cs.ut.ee/2021/cg-pro/fall/Main/Project-TileableTextureEditor?action=download&upname=tileEditorMilestone4.png)</div>

The application can currently: upload an image, preview it, filter it in black and white, revert the changes, download the result or delete the preview.

Dowload the [build](https://github.com/Freccialata/tileable-texture-editor/releases/tag/v0.0.1-alpha) v0.0.1 alpha.

The research on the topic of automatic texture tiling is narrow, but well documented. Some papers on the topic:

1.  [On Histogram-preserving Blending for Randomized Texture Tiling](https://www.jcgt.org/published/0008/04/02/paper-lowres.pdf)
2.  [Texture Tiling on Arbitrary Topological Surfaces using Wang Tiles](https://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.100.5041&rep=rep1&type=pdf)
3.  [Novel Path Search Algorithm for Image Stitching and Advanced Texture Tiling](https://otik.uk.zcu.cz/bitstream/11025/10965/1/Somol.pdf)

Paper number **1.** is chosen to be implemented.  
Benedikt Bitterli already has an implementation on [his website](https://benedikt-bitterli.me/histogram-tiling/).

![](https://courses.cs.ut.ee/2021/cg-pro/fall/Main/Project-TileableTextureEditor?action=download&upname=benedBitt_textTileSite.png)

Started learning the theory of the algorithm and playing with B. Bitterli's code. For now the study is done on a separate web page. The idea is to port it to the Electron application once my personal implementation is finalised and I understand the algorithm completely.

A screenshot of the current progress:

![](https://courses.cs.ut.ee/2021/cg-pro/fall/Main/Project-TileableTextureEditor?action=download&upname=histTestScreenShot.png)

The code is always available on [GitHub](https://github.com/Freccialata/tileable-texture-editor/tree/master).

### Milestone 5 (30.11)

<div style="text-decoration: line-through; font-size: 10px;">

*   Improve UI and parameters names
*   More texture experiments

</div>

*   Finalise study on Histogram-preserving Blending (3h)
*   Implement Histogram-preserving Blending (4h)

#### Development notes

After finalising the study on Histogram-preserving blending and its implementation, the result is described in the following flowchart:

![](https://courses.cs.ut.ee/2021/cg-pro/fall/Main/Project-TileableTextureEditor?action=download&upname=tiling_flowchart_rockexampl.png)

The editor now looks like this (examples with two different textures):

![](https://courses.cs.ut.ee/2021/cg-pro/fall/Main/Project-TileableTextureEditor?action=download&upname=realease2_01.png)

![](https://courses.cs.ut.ee/2021/cg-pro/fall/Main/Project-TileableTextureEditor?action=download&upname=realease2_02.png)

Now it is possible to upload any texture and get its seamless version and visualise the original input pattern.

Dowload the [build](https://github.com/Freccialata/tileable-texture-editor/releases/tag/v0.0.2-alpha) v0.0.2 alpha.

There is a caveat on the uploaded image: the pattern is pre-processed and cut before the histogram-preserving blending and the user does not know which part of the image is considered by the algorithm. Therefore, a UI prompt should be added to give the user more control on the final seamless pattern.

![](https://courses.cs.ut.ee/2021/cg-pro/fall/Main/Project-TileableTextureEditor?action=download&upname=cropping.png)

### Milestone 6 (14.12)

<div style="text-decoration: line-through; font-size: 10px;">

*   Enhance the generator algorithm if necessary
*   Create a shareable build (web assembly?)
*   Create image and video presentation

</div>

*   UI enhancements: repeating pattern preview, button press effect (2h)
*   Deploy the application as a website (1h)
*   Show a preview of the cut texture to help understand which part of a texture is processed. (2h)
*   Expose number of repetitions parameter (2h)

The application is now accessible on [freccialata.github.io](https://freccialata.github.io/tileable-texture-editor)

![](https://courses.cs.ut.ee/2021/cg-pro/fall/Main/Project-TileableTextureEditor?action=download&upname=UI_milest06.png)
