function createCylinderGeometry(r, h, r_steps, h_steps) {
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
    const normals = []
    r = typeof r != 'undefined' ? r : 1
    h = typeof h != 'undefined' ? r : 2
    r_steps = typeof r_steps != 'undefined' ? r_steps : 22
    h_steps = typeof h_steps != 'undefined' ? h_steps : 2
    const geometry = new THREE.Geometry();
    const v = geometry.vertices
    const zup = new THREE.Vector3(0, 0, 1)
    const zdn = new THREE.Vector3(0, 0, -1)
    const nv = [zdn, zup]
    v.push(new THREE.Vector3(0, 0, -0.5 * h))
    v.push(new THREE.Vector3(0, 0, +0.5 * h))
    for (var h_it = 0; h_it <= h_steps; h_it++) {
        var h_val = (h_it / h_steps - 0.5) * h
        for (var r_it = 0; r_it < r_steps; r_it++) {
            var r_val = r_it / r_steps * 2 * Math.PI
            // cosine and sine
            var c = Math.cos(r_val)
            var s = Math.sin(r_val)
            // coords
            var x = c * r
            var y = s * r
            var z = h_val
            // point and normal
            var p = new THREE.Vector3(x, y, z)
            var n = new THREE.Vector3(c, s, 0)
            v.push(p)
            nv.push(n)
        }
    }
    for (var h_it = 0; h_it < h_steps; h_it++) {
        for (var r_it = 0; r_it < r_steps; r_it++) {
            var a = 2 + (r_it + 0) % r_steps + ((h_it + 0) * r_steps)
            var b = 2 + (r_it + 0) % r_steps + ((h_it + 1) * r_steps)
            var c = 2 + (r_it + 1) % r_steps + ((h_it + 0) * r_steps)
            var d = 2 + (r_it + 1) % r_steps + ((h_it + 1) * r_steps)

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
            // Example with r_steps = 4, h_steps = 4
            //
            //         21 - center top
            //
            //   17  18  19  20 - top circle
            //
            //   13  14  15  16
            //
            //    9  10  11  12
            //
            //    5   6   7   8
            //
            //    1   2   3   4 - bottom circle
            //
            //          0 - center bottom

            geometry.faces.push(new THREE.Face3(c, b, a, [nv[c], nv[b], nv[a]]))
            geometry.faces.push(new THREE.Face3(b, c, d, [nv[b], nv[c], nv[d]]))
            if (h_it == 0) geometry.faces.push(new THREE.Face3(0, c, a, [zdn, zdn, zdn]))
            if (h_it == h_steps - 1) geometry.faces.push(new THREE.Face3(1, b, d, [zup, zup, zup]))
        }
    }
    return geometry
}
