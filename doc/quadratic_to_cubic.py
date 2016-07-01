#!/usr/bin/env python3

lerp = lambda s, e, t: s + (e-s) * t
t = 0.65
cp0, cp1, cp2 = ((0, 300), (25, 50), (500,300))

def convert(*args):
    zipped = zip(args, args[1:])
    l = len(args)
    yield args[0]

    for m in enumerate(zipped):
        i, t = m
        left, right = t
        yield lerp(left, right, (l - i - 1) / l)
    yield args[-1]

operate_on_points = lambda f, p: zip(*(f(*P) for P in zip(*p)))
c0, c1, c2, c3 = tuple(operate_on_points(convert, (cp0, cp1, cp2)))

print("""<svg width="100%" height="100%" viewBox="-10 -10 520 320" preserveAspectRatio="xMidYMid" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <defs>
      <g id="control_point">
        <circle r="4" fill="none" stroke="black"/>
        <circle r="2" fill="black" stroke="none"/>
      </g>
      <style>
        text {{
            font-size: 8pt;
            fill: black;
        }}
      </style>
    </defs>
    <path d="M{cp0[0]},{cp0[1]} Q{cp1[0]},{cp1[1]} {cp2[0]},{cp2[1]}" fill="none" stroke="hsl(196, 100%, 42%)" stroke-width="6"/>
    <polyline points="{cp0[0]},{cp0[1]} {cp1[0]},{cp1[1]} {cp2[0]},{cp2[1]}" fill="none" stroke="hsl(196, 100%, 42%)" stroke-width="6"/>
    <path d="M{c0[0]},{c0[1]} C{c1[0]},{c1[1]} {c2[0]},{c2[1]} {c3[0]},{c3[1]}" fill="none" stroke="black" stroke-width="2"/>
    <polyline points="{c0[0]},{c0[1]} {c1[0]},{c1[1]} {c2[0]},{c2[1]} {c3[0]},{c3[1]}" fill="none" stroke="black" stroke-width="2"/>

    <use x="{cp0[0]}" y="{cp0[1]}" xlink:href="#control_point" />
    <use x="{cp1[0]}" y="{cp1[1]}" xlink:href="#control_point" />
    <use x="{cp2[0]}" y="{cp2[1]}" xlink:href="#control_point" />


    <use x="{c0[0]}" y="{c0[1]}" xlink:href="#control_point" />
    <use x="{c1[0]}" y="{c1[1]}" xlink:href="#control_point" />
    <use x="{c2[0]}" y="{c2[1]}" xlink:href="#control_point" />
    <use x="{c3[0]}" y="{c3[1]}" xlink:href="#control_point" />
</svg>""".format(
    c0 = c0,
    c1 = c1,
    c2 = c2,
    c3 = c3,
    cp0 = cp0,
    cp1 = cp1,
    cp2 = cp2
    ))
