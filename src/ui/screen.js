import blessed from "neo-blessed"
import { Editor } from "./editor.js"

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
    const editorBox = blessed.box({
        parent: screen,
        top: 0,
        left: 0,
        width: "70%",
        height: "100%",
        border: "line",
        keys: true,
        mouse: true,
        // input: true,
        focusable: true,
        style: {
            border: { fg: "cyan" },
        },
        hidden: true,
    })
    const editor = new Editor(screen, editorBox)
    screen.on("keypress", (ch, key) => {
        if (key.name === "backspace") {
            editor.handleBackspace()
            return
        }
        if (key.name === "enter") {
            return
        }
        editor.handleKeypress(ch, key)
    })
    screen.key(["enter"], () => { editor.handleEnter() })

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

    screen.key(["0"], () => {
        start.destroy()
        editorBox.show()
        editorBox.focus()
        screen.render()
        editor.render()
    })

    // Delegate arrow keys to the editor
    screen.key(["left"], () => editor.moveLeft())
    screen.key(["right"], () => editor.moveRight())
    screen.key(["up"], () => editor.moveUp())
    screen.key(["down"], () => editor.moveDown())

    // Quit key
    screen.key(["q", "C-c"], () => process.exit(0))
    screen.render()
}