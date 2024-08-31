class Vec2 {
    constructor(x = 0, y = 0) {
      this.x = x;
      this.y = y;
    }
  
    // Add another vector to this vector
    add(vec) {
      return new Vec2(this.x + vec.x, this.y + vec.y);
    }
  
    // Subtract another vector from this vector
    subtract(vec) {
      return new Vec2(this.x - vec.x, this.y - vec.y);
    }
  
    // Scale this vector by a scalar value
    scale(scalar) {
      return new Vec2(this.x * scalar, this.y * scalar);
    }
  
    // Calculate the magnitude (length) of the vector
    magnitude() {
      return Math.sqrt(this.x * this.x + this.y * this.y);
    }
  
    // Calculate the dot product of this vector and another vector
    dot(vec) {
      return this.x * vec.x + this.y * vec.y;
    }
  
    // Normalize the vector (make its length 1)
    normalize() {
      const mag = this.magnitude();
      return mag === 0 ? new Vec2() : this.scale(1 / mag);
    }
  
    // Convert the vector to a string
    toString() {
      return `Vec2(${this.x}, ${this.y})`;
    }
  }

export default Vec2