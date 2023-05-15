# Kusama Delegate Accounts

## Summary
This is an API that uses the kusama substrate to solve the proxy problem as stated in this issue https://github.com/subsquid/bounties/issues/9

## Setup
More details on how to setup can be seen in the setup file [here](/setup.md)

## Concept

- Listens for [ProxyAdded](https://kusama.subscan.io/event?module=Proxy&event=ProxyAdded) events and creates the proxies 
- Listens for [ProxyRemoved](https://kusama.subscan.io/event?module=Proxy&event=ProxyAdded) events and deleted the proxies


