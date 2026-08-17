# Discovery

> Draft.

Discovery allows applications to find mroky nodes on a local network.

## Intended flow

1. Application starts discovery.
2. Discovery request is sent.
3. mroky nodes respond.
4. Application collects available nodes.
5. Application opens a session.

## Example

Conceptually:

```text
CLIENT
  |
  | DISCOVER
  |
  +-------------------->
                       NODE A
  <--------------------+
       RESPONSE
```

The exact transport and packet format are not yet final.
