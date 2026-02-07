import blessed from "blessed"

export function createScreen() {
    const screen = blessed.screen({
        smartCSR: true,
        title: "carbon",
    })

    // Main window
    const box = blessed.box({
        parent: screen,
        top: 0,
        left: 0,
        width: "100%",
        height: "100%-1",
        tags: true,
        border: "line",
        style: {
            border: { fg: "cyan" },
        },
        content: "carbonIDE\n\nPress 'q' to quit.",
    })

    // Statusbar
    const status = blessed.box({
        parent: screen,
        bottom: 0,
        left: 0,
        width: "100%",
        height: 1,
        style: {
            bg: "gray",
            fg: "black",
        },
        content: "  carbon - ready"
    })

    // Quit key
    screen.key(["q", "C-c"], () => process.exit(0))
    screen.render()
}