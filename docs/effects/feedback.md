---
title: Feedback
description: Feedback buffer effect
---

# Feedback

Feedback feeds a previous frame back into the current frame.

This is useful for:

- trails
- echoes
- recursive visuals
- generative graphics

## Concept

```text
INPUT
  |
  v
EFFECT
  |
  +------> OUTPUT
  |
  +------> FEEDBACK BUFFER
                |
                +----> next frame
```

## Parameters

The planned implementation will expose controls such as:

- amount
- decay
- blend mode
- transform
