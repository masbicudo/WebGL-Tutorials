---
title: WebGL-Tutorials
layout: default
---

{% include mathjax.html %}

# Cilindro

## Rotação controlada manualmente

Rotacionar objetos pode parecer trivial, mas obter um resultado intuitivo não é.

A rotação de objetos deve ter algum ponto de referência e
além disso deve possuir uma orientação espacial para saber
os eixos possíveis de rotação.

### Rotação da câmera em torno do objeto central

Essa é uma transformação um tanto quanto complicada.
Ele requer que olhemos para a câmera do ponto de vista do
sistema de coordenadas centrado no objeto, mas com os mesmos
eixos de orientação espacial da câmera e não do objeto.

Primeiramente obtenho o objeto em coordenadas de câmera.
Temos o objeto em coordenadas de mundo $o_w$, e temos a
matriz inversa da câmera $C^{-1}$, então podemos obter $o_c$:

$$o_c = C^{-1} o_w$$

Agora podemos criar uma matriz de translação,
que leva do objeto para a câmera dentro do
sistema de coordenadas da câmera.
Basta definir a última coluna da identidade com o
vetor posição do objeto $o_c$:

$$
    T = \left[
    \begin{matrix}
    1 &   &   & \vdots  \\
      & 1 &   &   o_c   \\
      &   & 1 & \vdots  \\
      &   &   & 1       \\
    \end{matrix}
    \right]
$$

Temos que usar a inversa dela para levar a câmera até o objeto.
Aplicar a operação de rotação $R$ e depois voltar com a câmera
para o lugar aplicando a transformação que leva o objeto para
a câmera:

$$
    N = T R T^{-1}
$$

O que temos agora é a nova câmera rotacionada em torno do objeto,
no sistema de coordenadas da câmera antiga.

Acontece que a matriz da câmera, é uma que leva do sistema da
câmera para o sistema do mundo, que é exatamente a matriz $N$
transformada do sistema de câmera para o de mundo:

$$
    C_{novo} = CN
$$

### Rotação de outros objetos em torno do objeto central

Agora que temos uma fórmula para rotacionar a câmera em torno
do objeto central, basta generalizar para outros objetos além
da câmera.

Qualquer objeto que assim como a câmera tenha um sistema de
coordenadas que o orienta no sistema de mundo, além de ter uma
posição, pode ser rotacionado em torno de qualquer ponto.
Basta trocas as variáveis anteriormente explicadas.

### Método object_relative_movement

Com isso criei o método `object_relative_movement`,
que aceita os seguintes parâmetros:

- position (Vertex3): The reference position for the transformation.
- object (Mesh\|Camera\|Light): The object that will be rotated about the given position.
- transformation (Matrix4): The matrix representing the transformation that will be applied to the object.

# Referências

### Usando matrizes, câmeras e tecnicas para rotacionar

- [Matrix4](https://threejs.org/docs/#api/en/math/Matrix4) @threejs.org
- [Mesh](https://threejs.org/docs/#api/en/objects/Mesh.geometry) @threejs.org
- [SphereGeometry](https://threejs.org/docs/#api/en/geometries/SphereGeometry) @threejs.org
- [Camera](https://threejs.org/docs/#api/en/cameras/Camera.matrixWorldInverse) @threejs.org
- [Setting the camera matrix manually in ThreeJS](https://stackoverflow.com/questions/18470156/setting-the-camera-matrix-manually-in-threejs) @stackoverflow.com
- [How to rotate a 3D object on axis three.js?](https://stackoverflow.com/questions/11060734/how-to-rotate-a-3d-object-on-axis-three-js/13277579) @stackoverflow.com
- [Rotate 3D camera relative to what's on screen (in threejs)](https://gamedev.stackexchange.com/questions/29319/rotate-3d-camera-relative-to-whats-on-screen-in-threejs) @gamedev.stackexchange.com

### UV Map Grids

Eu usei algumas texturas que não são minhas nestes exemplos.
Aqui estão algumas informações sobre como econtrá-las.

Pesquisas no Google por imagens:

- [Google image search: uv test texture](https://www.google.com/search?tbm=isch&q=uv+test+texture)
- [Google image search: uv map texture](https://www.google.com/search?tbm=isch&q=uv+map+texture)
- [Google image search: uv_test_bw](https://www.google.com/search?tbm=isch&q=uv_test_bw)

Sites com images para testes de mapeamento de texturas:

- [Texture Coordinates #UV Map Grids](http://wiki.polycount.com/wiki/Texture_Coordinates#UV_Map_Grids) @wiki.polycount.com
- [UV Checker Texture](https://www.oxpal.com/uv-checker-texture.html) @www.oxpal.com

### Outros

- [Estilizando as tags `kbd`](https://auth0.github.io/kbd/)
- [How to set up MathJax on Jekyll and GitHub properly?](http://csega.github.io/mypost/2017/03/28/how-to-set-up-mathjax-on-jekyll-and-github-properly.html)
- [MathJax basic tutorial and quick reference](https://math.meta.stackexchange.com/questions/5020/mathjax-basic-tutorial-and-quick-reference)
