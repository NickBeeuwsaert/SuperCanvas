[![Build Status](https://travis-ci.org/NickBeeuwsaert/SuperCanvas.svg?branch=master)](https://travis-ci.org/NickBeeuwsaert/SuperCanvas)
[![Flattr this git repo](http://api.flattr.com/button/flattr-badge-large.png)](https://flattr.com/submit/auto?user_id=NickBeeuwsaert&url=https://github.com/NickBeeuwsaert/SuperCanvas&title=SuperCanvas&language=&tags=github&category=software)
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/NickBeeuwsaert/SuperCanvas?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

SuperCanvas
===========
SuperCanvas is a Javascript Library to parse SVG paths and use them in HTML5 Canvas

Check it out:

```javascript
  var superCanvas = new SuperCanvas(document.getElementById("canvas"));
  // Path from RaphaelJS's excellent collection of free icons: http://raphaeljs.com/icons/#svg
  var SVGLogo = "M31.274,15.989c0-2.473-2.005-4.478-4.478-4.478l0,0c0.81-0.811,1.312-1.93,1.312-3.167c0-2.474-2.005-4.479-4.479-4.479c-1.236,0-2.356,0.501-3.167,1.312c0-2.473-2.005-4.478-4.478-4.478c-2.474,0-4.479,2.005-4.479,4.478c-0.811-0.81-1.93-1.312-3.167-1.312c-2.474,0-4.479,2.005-4.479,4.479c0,1.236,0.501,2.356,1.312,3.166c-2.474,0-4.479,2.005-4.479,4.479c0,2.474,2.005,4.479,4.479,4.479c-0.811,0.81-1.312,1.93-1.312,3.167c0,2.473,2.005,4.478,4.479,4.478c1.236,0,2.356-0.501,3.167-1.312c0,2.473,2.005,4.479,4.479,4.479c2.473,0,4.478-2.006,4.478-4.479l0,0c0.811,0.811,1.931,1.312,3.167,1.312c2.474,0,4.478-2.005,4.478-4.478c0-1.237-0.501-2.357-1.312-3.168c0.001,0,0.001,0,0.001,0C29.27,20.467,31.274,18.463,31.274,15.989zM23.583,21.211c0.016,0,0.031-0.001,0.047-0.001c1.339,0,2.424,1.085,2.424,2.425c0,1.338-1.085,2.424-2.424,2.424s-2.424-1.086-2.424-2.424c0-0.017,0.001-0.031,0.001-0.047l-3.541-3.542v5.009c0.457,0.44,0.743,1.06,0.743,1.746c0,1.339-1.086,2.424-2.424,2.424c-1.339,0-2.425-1.085-2.425-2.424c0-0.687,0.286-1.306,0.743-1.746v-5.009l-3.541,3.542c0,0.016,0.001,0.031,0.001,0.047c0,1.338-1.085,2.424-2.424,2.424s-2.424-1.086-2.424-2.424c0-1.34,1.085-2.425,2.424-2.425c0.015,0,0.031,0.001,0.046,0.001l3.542-3.541H6.919c-0.44,0.458-1.06,0.743-1.746,0.743c-1.339,0-2.424-1.085-2.424-2.424s1.085-2.424,2.424-2.424c0.686,0,1.305,0.285,1.746,0.744h5.008l-3.542-3.542c-0.015,0-0.031,0.001-0.046,0.001c-1.339,0-2.424-1.085-2.424-2.424S7.001,5.92,8.34,5.92s2.424,1.085,2.424,2.424c0,0.015-0.001,0.031-0.001,0.046l3.541,3.542V6.924c-0.457-0.441-0.743-1.06-0.743-1.746c0-1.339,1.086-2.425,2.425-2.425c1.338,0,2.424,1.085,2.424,2.425c0,0.686-0.286,1.305-0.743,1.746v5.008l3.541-3.542c0-0.015-0.001-0.031-0.001-0.046c0-1.339,1.085-2.424,2.424-2.424s2.424,1.085,2.424,2.424c0,1.339-1.085,2.424-2.424,2.424c-0.016,0-0.031-0.001-0.047-0.001l-3.541,3.542h5.008c0.441-0.458,1.061-0.744,1.747-0.744c1.338,0,2.423,1.085,2.423,2.424s-1.085,2.424-2.423,2.424c-0.687,0-1.306-0.285-1.747-0.743h-5.008L23.583,21.211z";
  superCanvas.drawPath(SVGLogo);
  superCanvas.fill();
```

You can also iterate over the path if you want to process individual segments:


```javascript
  SuperCanvas.Path.each(SVGLogo, function(segment) {
    console.log(segment);
  });
```

So yeah that's all cool. Head on over to the [documentation](https://nickbeeuwsaert.github.io/SuperCanvas/) to read more. We got a fancy Sphinx site there. 
