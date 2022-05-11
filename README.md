# Figma Tokens Inspector

Inspector for [Figma tokens](https://github.com/six7/figma-tokens), running in view only mode.

# Usage

1. Download load extension.crx from [release page](https://github.com/ZeekoZhu/figma-tokens-inspector/releases).
2. Drag and drop extension.crx to your browser (Only chrome based browser is supported now).
3. Open a figma file in your browser, and a popup will show up.
4. Navigate to "Settings", and set your Figma personal access token.
![image](https://user-images.githubusercontent.com/13861843/167753201-cf7d275b-e920-4dfe-8848-2976cbc98eb4.png)
5. Back to "Inspector", and select nodes in Figma canvas to inspect design tokens.
![image](https://user-images.githubusercontent.com/13861843/167753241-5b1a966c-3296-46bf-b2e7-4ff0526af410.png)


# How to build

**Requirement**
* GNU make@4
* node.js@16
* yarn@1

```sh
make crx
ls -l ./dist/
```
