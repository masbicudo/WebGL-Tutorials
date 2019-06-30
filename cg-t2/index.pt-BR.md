---
title: WebGL-Tutorials
layout: default
---

# O que é isso?

Esse é o meu trabalho final da disciplina de Computação Gráfica. A disciplina é parte do curso de [Ciência da Computação](https://dcc.ufrj.br/) na UFRJ (Universidade Federal do Rio de Janeiro), e foi ministrado pelo professor [Paulo Roma](http://orion.lcg.ufrj.br/roma/index.html), no primeiro semestre de 2019.

A descrição do trabalho está na [página do professor](http://orion.lcg.ufrj.br/WebGL/laboratorios.html), especificamente o item 6:

- 6) Implemente um visualizador e texturizador de quádricas em OpenGL, WebGL, ou em Python com PyOpenGL e NumPy.

# Versão em Inglês

Estou fazendo toda a parte documental em português primeiro, e o código em inglês.
Mais pra frente vou atualizar a parte da documentação em inglês.

[versão en-US](index)

# Linha do tempo

### Dia 1

No primeiro dia foi tudo bem simples. O THREE JS cuida
de vários aspectos para o programador, que não tem que lidar
com shaders, nem com a complexidade de carregar as faces
na ordem correta.

Também é bem símples lidar com iluminação,
cores dos objetos, e renderização em vários formatos:
iluminado, aramado, entre outros.

1. [Cena simples](1-simple-scene)
2. [Animando a cena](2-simple-animated-scene)
3. [Iluminação simples](3-simple-lit-scene)
4. [Geometria customizada de cilindro](4-custom-cylinder-geometry)
5. [Arestas da geometria](5-geometry-edges)
6. [Normais computadas](6-custom-geometry-generated-normals)
7. Normais da geometria customizada calculadas manualmente
- a) [Normais manuais calculadas erroneamente](7a-custom-geometry-wrong-normals)
- b) [Normais manuais corrigidas](7b-custom-geometry-normals)
8. [Aramado e normais](8-geometry-wireframe-normals)

### Dia 2

No segundo dia, tive que lidar com as complexidades de mapear texturas.
O principal problema é mapear texturas em superfícies que não
possuem um mapeamento linear para as coordenadas de textura chamadas de UV.

Veja mais: [Relatório sobre texturização do cilindro](9-cylider-texture-ref)

9. [Texturizando o cilindro](9-cylider-texture)
- a) [Problemas com a face circular](9a-texture-wrong)
- b) [Tentativa de correção com divisão em anel + círculo pequeno](9b-texture-wrong-2)
- c) [Correção com divisão em anéis de potências de fração](9c-texture)

### Dia 3

Uma das coisas fazem falta é poder controlar manualmente
os objetos na tela. Portanto, no terceiro dia vou adicionar
controles usando o teclado e mouse.

Além disso vou adicionar botões e caixas para poder configurar
a figura na tela, permitir visualizar as várias formas de renderização,
alterar texturas, cores e outras características.

10. [Controles de teclado](10-keyboard-controls)
