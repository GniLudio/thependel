# The Pendulum
>This art project draws pendulums on the canvas.

![canvas](https://github.com/GniLudio/thependel/blob/7574ffd30c277f9a7ed940929b0cfb4edef47cb8/preview.png)

## Website
The project can be found on [https://gniludio.github.io/thependel/](https://gniludio.github.io/thependel/).

## Future Ideas

### Fading Out
It would be very appealing if each pendulum has an additional fade duration after which the drawn line disappears. I tried to make that work through several ways, but found no satisfactory solution.

1. clear canvas and redraw everything which didn't fade out
    * very slow
2. clear canvas and redraw everything through `bezierCurve` in big steps (e.g. 45°)
    * a lot faster than 1. (still very unefficient)
    * redrawing doesn't result in the same image
3. [fabric.js](http://fabricjs.com/)
    * tried with Polylines and with grouped Lines
    * both too slow
