import blessed from "neo-blessed"

export function createScreen() {
    const screen = blessed.screen({
        smartCSR: true,
        title: "carbonIDE",
    })

    // Main window
    const start = blessed.box({
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

    // editor
    const editor = blessed.textarea({
        parent: screen,
        top: 0,
        left: 0,
        width: "70%",
        height: "100%",
        border: "line",
        keys: true,
        mouse: true,
        inputOnFocus: true,
        multiline: true,
        style: {
            border: { fg: "cyan" },
        },
        hidden: true,
    })

    // Statusbar
    const status = blessed.box({
        parent: screen,
        bottom: 0,
        left: 0,
        width: "100%",
        height: 1,
        style: {
            // inverse: true,
            bg: "brightblack",
            fg: "white",
        },
        content: "   carbon - editor only mode",
    })

    screen.key(["enter"], () => {
        start.destroy()
        editor.show()
        status.show()
        editor.focus()
        screen.render()
    })

    // Quit key
    screen.key(["q", "C-c"], () => process.exit(0))
    screen.render()
}