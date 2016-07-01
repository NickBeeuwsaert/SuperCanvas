#!/usr/bin/env python

lerp = lambda s, e, t: tuple(S + (E-S)*t for S, E in zip(s,e))
t = 0.65
cp0, cp1, cp2, cp3 = ((0, 300), (25, 50), (450, 50), (500,300))

M0 = lerp(cp0, cp1, t)
M1 = lerp(cp1, cp2, t)
M2 = lerp(cp2, cp3, t)

M3 = lerp(M0, M1, t)
M4 = lerp(M1, M2, t)

M5 = lerp(M3, M4, t)

print("""<svg width="100%" height="100%" viewBox="-10 -10 520 320" preserveAspectRatio="xMidYMid" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <!-- Generated with {} -->
    <defs>
      <circle r="4" id="control_point" fill="none" stroke="black"/>
      <circle r="2" id="mid_point" fill="black" stroke="none"/>
      <style>
        text {{
            font-size: 8pt;
            fill: black;
        }}
      </style>
    </defs>
    <text x="0" y="8">t = {t}</text>
    <path d="M{cp0[0]},{cp0[1]} C{cp1[0]},{cp1[1]} {cp2[0]},{cp2[1]} {cp3[0]},{cp3[1]}" fill="none" stroke="hsl(196, 100%, 42%)" stroke-width="6"/>

    <path d="M{cp0[0]},{cp0[1]} C{M0[0]},{M0[1]} {M3[0]},{M3[1]} {M5[0]},{M5[1]}" fill="none" stroke="red" stroke-width="2"/>
    <path d="M{M5[0]},{M5[1]} C{M4[0]},{M4[1]} {M2[0]},{M2[1]} {cp3[0]},{cp3[1]}" fill="none" stroke="green" stroke-width="2"/>
    <!-- draw lines -->
    <polyline fill="none" stroke="hsl(196, 100%, 42%)" stroke-dasharray="5,5"
              points="{cp0[0]},{cp0[1]} {cp1[0]},{cp1[1]} {cp2[0]},{cp2[1]} {cp3[0]},{cp3[1]}"/>
    <polyline fill="none" stroke="hsl(196, 100%, 42%)" 
              points="{M0[0]},{M0[1]} {M1[0]},{M1[1]} {M2[0]},{M2[1]}"/>
    <polyline fill="none" stroke="hsl(196, 100%, 42%)" 
              points="{M3[0]},{M3[1]} {M4[0]},{M4[1]}"/>

    <!-- draw in the control points -->
    <use x="{cp0[0]}" y="{cp0[1]}" xlink:href="#control_point" />
    <use x="{cp1[0]}" y="{cp1[1]}" xlink:href="#control_point" />
    <use x="{cp2[0]}" y="{cp2[1]}" xlink:href="#control_point" />
    <use x="{cp3[0]}" y="{cp3[1]}" xlink:href="#control_point" />

    <!-- draw all the midpoints -->
    <use x="{M0[0]}" y="{M0[1]}" xlink:href="#mid_point" />
    <use x="{M1[0]}" y="{M1[1]}" xlink:href="#mid_point" />
    <use x="{M2[0]}" y="{M2[1]}" xlink:href="#mid_point" />
    <use x="{M3[0]}" y="{M3[1]}" xlink:href="#mid_point" />
    <use x="{M4[0]}" y="{M4[1]}" xlink:href="#mid_point" />
    <use x="{M5[0]}" y="{M5[1]}" xlink:href="#mid_point" />

    <!-- draw secondary control points -->

    <use x="{M0[0]}" y="{M0[1]}" xlink:href="#control_point" />
    <use x="{M5[0]}" y="{M5[1]}" xlink:href="#control_point" />
    <use x="{M2[0]}" y="{M2[1]}" xlink:href="#control_point" />
    <use x="{M3[0]}" y="{M3[1]}" xlink:href="#control_point" />
    <use x="{M4[0]}" y="{M4[1]}" xlink:href="#control_point" />

    <text x="{cp0[0]}" y="{cp0[1]}">P<tspan baseline-shift="sub">0,0</tspan><!-- = {cp0} --></text>
    <text x="{cp1[0]}" y="{cp1[1]}">P<tspan baseline-shift="sub">0,1</tspan><!-- = {cp1} --></text>
    <text x="{cp2[0]}" y="{cp2[1]}">P<tspan baseline-shift="sub">0,2</tspan><!-- = {cp2} --></text>
    <text x="{cp3[0]}" y="{cp3[1]}">P<tspan baseline-shift="sub">0,3</tspan><!-- = {cp3} --></text>

    <text x="{M0[0]}" y="{M0[1]}"  >P<tspan baseline-shift="sub">1,0</tspan><!-- = {M0}  --></text>
    <text x="{M1[0]}" y="{M1[1]}"  >P<tspan baseline-shift="sub">1,1</tspan><!-- = {M1}  --></text>
    <text x="{M2[0]}" y="{M2[1]}"  >P<tspan baseline-shift="sub">1,2</tspan><!-- = {M2}  --></text>

    <text x="{M3[0]}" y="{M3[1]}"  >P<tspan baseline-shift="sub">2,0</tspan><!-- = {M3}  --></text>
    <text x="{M4[0]}" y="{M4[1]}"  >P<tspan baseline-shift="sub">2,1</tspan><!-- = {M4}  --></text>

    <text x="{M5[0]}" y="{M5[1]}"  >P<tspan baseline-shift="sub">3,0</tspan><!-- = {M5}  --></text>


</svg>""".format(
    __file__,
    t = t,
    cp0 = cp0,
    cp1 = cp1,
    cp2 = cp2,
    cp3 = cp3,
    M0 = M0, M1 = M1, M2 = M2,
    M3 = M3, M4 = M4,
    M5 = M5
    ))
