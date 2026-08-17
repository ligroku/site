# mroky Protocol

> Draft specification.

This document describes the intended protocol model. It is currently a design document rather than a stable wire specification.

## Concepts

A mroky network consists of:

- nodes
- endpoints
- sessions
- messages
- streams

## Node

A node is a participant on the network.

Examples:

- lighting computer
- media server
- audio workstation
- installation controller

## Endpoint

An endpoint exposes a controllable or observable resource.

## Message

Messages carry commands, state changes and other protocol information.

A future stable specification will define:

- header
- message type
- source
- destination
- timestamp
- payload
- flags

## Status

This specification is experimental and will evolve with the implementation.
