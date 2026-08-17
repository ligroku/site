---
title: mroky
description: Mihous network and control protocol
---

# mroky

**mroky** is the networking and control layer currently being developed inside Mihous.

The goal is to make show-control infrastructure easier to integrate into creative software, with a developer experience that feels smaller and more direct than legacy systems.

> Status: early development. The API and wire format are expected to change.

## Why mroky?

Creative software often ends up rebuilding the same pieces:

- discover devices
- exchange control data
- describe streams
- connect sources and destinations
- keep state synchronized
- expose diagnostics

mroky is intended to provide those primitives without forcing the artist-facing application to understand unnecessary infrastructure.

## Documentation

- [Protocol](./protocol.md)
- [Discovery](./discovery.md)
- [Examples](./examples.md)

## Design goals

### Simple

The protocol should be understandable without reading hundreds of pages of specifications.

### Fast

Network communication should have low overhead and predictable behaviour.

### Creative-software friendly

The API should fit naturally into applications used by:

- lighting designers
- VJs
- musicians
- visual artists
- installation artists
- stage designers
- creative programmers

### Open

The protocol and implementation should remain inspectable.

## Current implementation

The repository currently contains the initial C++20 module:

```cpp
export module mroky;
```
