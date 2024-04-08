class World {
    constructor(ctx, roadPoints) {
        this.ctx = ctx;
        this.width = ctx.canvas.width;
        this.height = ctx.canvas.height;

        this.camera = new Camera();
        this.road = new Road(this, {
            roadPoints: roadPoints,
            roadWidth: 20
        });
    }

    init() {

    }

    draw() {
        this.road.draw();
    }
}