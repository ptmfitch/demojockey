# demojockey README

Demo Jockey is a Visual Studio Code extension designed to simplify copying common scripts and files from various repositories. It is for internal MongoDB usage only.

## Setup

- Install the extension using the latest VSIX file
- Open a folder in Visual Studio Code
- Go to settings (⌘,) and type 'DemoJockey', the configuration options will appear
- Complete the paths config for each repo you'd like to use the command for
- (Hint) Use the pwd command in the root of each repo to get the correct path

## Features

Adds the 'POV Proof Exercise', 'Atlas Google POV' and 'TFW Micro Demo' commands to Visual Studio Code.
- Use ⌘⇧P to start typing a command
- Type 'DemoJockey' in the dialogue box, it will show autocomplete options
- Select which demo repository to choose from and hit enter
- Hit enter
- Select a demo from the list

⌘⇧P 'DemoJockey: POV Proof Exercise': Shortcut to select from a list of POV Proof Exercises to copy into your open VSCode project.

⌘⇧P 'DemoJockey: Atlas Google POV': Shortcut to select from a list of Atlas Google POVs to copy into your open VSCode project.

⌘⇧P 'DemoJockey: TFW Micro Demo': Shortcut to select from a list of TFW Micro Demos to copy into your open VSCode project.

## Release Notes

### 0.1.0

- Added POV Proof Exercise command
- Added Atlas Google POV command
- Added TFW Micro Demo command
- Added configuration for local repository paths
- Added error handling for common occurrences
- Added informative messages to aid users

### 0.1.3

- Added MongoDB to command names
- Added icons to commands
- Fixed a bug preventing updating configuration without reloading window