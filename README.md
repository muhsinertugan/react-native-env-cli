# React Native Environment CLI

A command-line interface tool for setting up and validating React Native development environments.

## Features

- ✅ Environment validation
- 🔍 Version checking for required tools
- 🛠️ Automatic installation of missing dependencies
- 📱 Virtual device management
- 🔄 Environment variable verification
- 🍺 Homebrew integration

## Installation

```bash
npm install -g react-native-env-cli
```

## Usage

Run the CLI tool with:

```bash
setup-env
```

The tool will guide you through the following checks:

1. **Version Check**: Validates installed versions of required tools:
   - Node.js
   - npm
   - Yarn
   - Watchman
   - Ruby
   - CocoaPods
   - Java
   - Android Studio
   - Xcode (macOS only)

2. **Environment Variables**: Verifies the presence and correctness of:
   - ANDROID_HOME
   - ANDROID_SDK_ROOT
   - JAVA_HOME

3. **Virtual Devices**: Checks for available:
   - Android Emulators
   - iOS Simulators (macOS only)

4. **Homebrew**: Verifies Homebrew installation (macOS only)

## Development

### Prerequisites

- Node.js >= 18
- Bun (for development)
- TypeScript

### Setup

1. Clone the repository
2. Install dependencies:

```bash
bun install
```

### Available Scripts

- `bun run dev` - Watch mode for development
- `bun run build` - Build the project
- `bun run test` - Run tests
- `bun run lint` - Lint the code
- `bun run format` - Format the code
- `bun run link-cli` - Link the CLI locally for testing

### Testing

The project uses Jest for testing. Run tests with:

```bash
bun run test
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License. See the [LICENSE](LICENSE) file for more details.

## Dependencies

- chalk - Terminal string styling
- commander - Command-line interface
- inquirer - Interactive command line prompts
- envinfo - Environment information
- semver - Semantic version parsing
