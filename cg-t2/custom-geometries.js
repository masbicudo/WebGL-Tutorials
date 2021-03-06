function createCylinderGeometry(r, h, a_steps, h_steps, a_tex_steps, r_steps, r_frac, compute_normals, compute_mappings) {
    /**
     * Cylinder Geometry function
     * @param {number?} r The radius of the cylinder
     * @param {number?} h The hight of the cylinder
     * @param {number?} a_steps Number of angular divisions
     * @param {number?} h_steps Number of height divisions
     * @param {number?} r_steps Number of radial divisions for the circular face
     * @param {number?} r_frac Fraction used to subdivide the circular faces
     * @param {number?} compute_normals Indicates whether to compute normals
     * @param {number?} compute_mappings Indicates whether to compute texture mapping
     * r_steps and r_frac must be used to avoid texturing glitches at top and bottom circular faces
     * @returns {Geometry}
     */

    if (typeof arguments[0] == 'object') {
      var args = arguments[0]
      r = args.r
      h = args.h
      a_steps = args.a_steps
      h_steps = args.h_steps
      a_tex_steps = args.a_tex_steps
      r_steps = args.r_steps
      r_frac = args.r_frac
      compute_normals = args.compute_normals
      compute_mappings = args.compute_mappings
    }

    // Cylinder
    // ========
    //
    // THREE JS does not have the notion of drawing quad-strips
    // You must give it a list of vertices, and then link vertices
    // 3 by 3 to compose triangles to represent the faces.
    // When using WebGL alone, we would draw multiple quad-strips,
    // possibly repeating vertices from the first quad-strip on the
    // second, because the second's base is the first's top.
    // In THREE JS this will not happen. We will create all the
    // needed vertices in one go, and then create all the faces.
    // Also in WebGL we would use many buffers to represent colors,
    // normals, and mappings, but THREE JS is different... it is
    // based on Geometry type. All attributes are passed in groups
    // of 3 values per face, not per vertex. That is how a single
    // vertex can have multiple normals, colors and mappings,
    // one for each face that it is part of.

    r = typeof r != 'undefined' ? r : 1
    h = typeof h != 'undefined' ? h : 2
    a_steps = typeof a_steps != 'undefined' ? a_steps : 22
    h_steps = typeof h_steps != 'undefined' ? h_steps : 2
    a_tex_steps = typeof a_tex_steps != 'undefined' ? a_tex_steps : 6
    r_steps = typeof r_steps != 'undefined' ? r_steps : 8
    r_frac = typeof r_frac != 'undefined' ? r_frac : 3/4
    const geometry = new THREE.Geometry();
    const v = geometry.vertices
    const zup = new THREE.Vector3(0, 0, 1)
    const zdn = new THREE.Vector3(0, 0, -1)
    const rnv = [] // radial normal vectors
    v.push(new THREE.Vector3(0, 0, -0.5 * h))
    v.push(new THREE.Vector3(0, 0, +0.5 * h))
    for (var h_it = -r_steps; h_it <= h_steps + r_steps; h_it++) {
      // h_mul is a multiplier for the height, and goes from -0.5 to +0.5
      var h_mul = h_it <= 0       ? -0.5 :
                  h_it >= h_steps ? +0.5 :
                  (h_it / h_steps - 0.5)
      var z = h*h_mul
      for (var r_it = 0; r_it < a_steps; r_it++) {
        var frac =  h_it < 0       ? Math.pow(r_frac, -h_it) :
                    h_it > h_steps ? Math.pow(r_frac, h_it - h_steps) :
                    1
        var angle = r_it/a_steps*2*Math.PI
        // cosine and sine
        var cos = Math.cos(angle)
        var sin = Math.sin(angle)
        // coords
        var x = r*cos*frac
        var y = r*sin*frac
        // point
        var p = new THREE.Vector3(x, y, z)
        v.push(p)
        // normal (only for the first circumference), all others use the same normals
        if (h_it == 0) rnv.push(new THREE.Vector3(cos, sin, 0))
      }
    }
    for (var h_it = -r_steps; h_it < h_steps + r_steps; h_it++) {
        var h_ind = h_it + r_steps
        for (var r_it = 0; r_it < a_steps; r_it++) {
            var a = 2 + (r_it + 0) % a_steps + ((h_ind + 0) * a_steps)
            var b = 2 + (r_it + 0) % a_steps + ((h_ind + 1) * a_steps)
            var c = 2 + (r_it + 1) % a_steps + ((h_ind + 0) * a_steps)
            var d = 2 + (r_it + 1) % a_steps + ((h_ind + 1) * a_steps)

            // Faces obey the right hand rule to determine what side is the front side
            // The thumb indicates where is the front face direction.
            // The other fingers indicate the order of the input vertices.
            // 
            // This is the organization of the vertices a, b, c and d:
            //   b---d  This represents the order of the vertices over the cylinder,
            //   |   |  as if we were looking to it from the outside. So we want to
            //   a---c  order them in a counter-clockwise way: ⭯
            //
            // First triangle: c->b->a   Second triangle: b->c->d
            //   b                         b 🡐 d
            //   🡓 🡔                         🡖 🡑
            //   a 🡒 c                         c
            //
            // Example with a_steps = 4, h_steps = 4, r_steps = 1
            //
            //         1 - center top
            //
            //   18  19  20  21 - top circle
            //
            //   14  15  16  17
            //
            //   10  11  12  13
            //
            //    6   7   8   9
            //
            //    2   3   4   5 - bottom circle
            //
            //          0 - center bottom
            //
            // Example with a_steps = 4, h_steps = 4, r_steps = 2
            //
            //         1 - center top
            //    26 27 28 29 - top circle subdivision
            //   22  23  24  25 - top circle
            //
            //   18  19  20  21
            //
            //   14  15  16  17
            //
            //   10  11  12  13
            //
            //    6   7   8   9 - bottom circle
            //     2  3  4  5 - bottom circle subdivision
            //          0 - center bottom

            // Normals
            //
            // The normals are calculated and placed inside the `rnv` array.
            // The correspondence between edges and indices in the rnv array is as follows:
            //  a -> (r_it + 0)%a_steps
            //  b -> (r_it + 0)%a_steps
            //  c -> (r_it + 1)%a_steps
            //  d -> (r_it + 1)%a_steps
            // Normals on the circumference repeat over every
            // complete cycle, that why a modulus is needed.
            var r0 = (r_it + 0)%a_steps
            var r1 = (r_it + 1)%a_steps

            // Texture
            //
            // The number of h_steps will tell us the number of times the texture will be repeated.
            // The number of a_tex_steps tells the number of times the texture will be repeated radially.
            // The top and bottom faces texturing is somewhat different, we would have to map 2 texture points
            // to the single point at the center of the circular surface.
            // This cannot be done... so the texture will present glitches.
            // To overcome that, I am going to subdivide each circular surface in many concentric rings,
            // with radius of powers of the fraction r_frac
            var u_ab = (r_it + 0) / a_steps * a_tex_steps
            var u_cd = (r_it + 1) / a_steps * a_tex_steps

            var normals = null
            if (h_it < 0)             normals = [zdn, zdn, zdn]
            else if (h_it >= h_steps)  normals = [zup, zup, zup]

            var r_ac = Math.sqrt(v[a].x*v[a].x + v[a].y*v[a].y)
            var v_ac =  h_it < 0 ? r_ac :
                        h_it >= h_steps ? 1 - r_ac :
                        0
            var r_bd = Math.sqrt(v[b].x*v[b].x + v[b].y*v[b].y)
            var v_bd =  h_it < 0 ? r_bd :
                        h_it >= h_steps ? 1 - r_bd :
                        1

            // bottom/top face rings and lateral faces
            geometry.faces.push(new THREE.Face3(c, b, a, normals || [rnv[r1], rnv[r0], rnv[r0]]))
            geometry.faceVertexUvs[0].push([
                new THREE.Vector2(u_cd, v_ac), // c
                new THREE.Vector2(u_ab, v_bd), // b
                new THREE.Vector2(u_ab, v_ac), // a
              ])

            geometry.faces.push(new THREE.Face3(b, c, d, normals || [rnv[r0], rnv[r1], rnv[r1]]))
            geometry.faceVertexUvs[0].push([
                new THREE.Vector2(u_ab, v_bd), // b
                new THREE.Vector2(u_cd, v_ac), // c
                new THREE.Vector2(u_cd, v_bd), // d
              ])

            // bottom face central circle
            if (h_it == -r_steps) {
              geometry.faces.push(new THREE.Face3(0, c, a, [zdn, zdn, zdn]))
              geometry.faceVertexUvs[0].push([
                new THREE.Vector2((u_ab+u_cd)/2, 0), // (b + d)/2
                new THREE.Vector2(u_cd, v_ac), // c
                new THREE.Vector2(u_ab, v_ac), // a
              ])
            }
            // top face central circle
            if (h_it == h_steps + r_steps - 1) {
              geometry.faces.push(new THREE.Face3(1, b, d, [zup, zup, zup]))
              geometry.faceVertexUvs[0].push([
                new THREE.Vector2((u_ab+u_cd)/2, 1), // (a + b)/2
                new THREE.Vector2(u_ab, v_bd), // b
                new THREE.Vector2(u_cd, v_bd), // d
              ])
            }
        }
    }
    geometry.uvsNeedUpdate = true
    return geometry
}
