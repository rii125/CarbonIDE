export class Editor {
    constructor(screen, box) {
        this.screen = screen
        this.box = box
        this.buffer = [""]
        this.cursor = { row: 0, col: 0 }
    }

    render() {
        this.box.setContent(this.buffer.join("\n"))
        this.screen.program.move(this.cursor.col + 1, this.cursor.row + 1)
        this.screen.render()
    }

    moveLeft() {
        if (this.cursor.col > 0) this.cursor.col--
        this.render()
    }

    moveRight() {
        const line = this.buffer[this.cursor.row]
        if (this.cursor.col < line.length) this.cursor.col++
        this.render()
    }

    moveUp() {
        if (this.cursor.row > 0) {
            this.cursor.row--
            this.cursor.col = Math.min(
            this.cursor.col,
            this.buffer[this.cursor.row].length
            )
        }
        this.render()
    }

    moveDown() {
        if (this.cursor.row < this.buffer.length - 1) {
            this.cursor.row++
            this.cursor.col = Math.min(
            this.cursor.col,
            this.buffer[this.cursor.row].length
            )
        }
        this.render()
    }

    handleKeypress(ch, key) {
        // Enter the question (issue:#1)
        if (key.name === "enter") return
        // Ignore Ctrl keys
        if (key.ctrl) return
        if (this.justEntered && ch === " ") {
            this.justEntered = false
            return
        }
        this.justEntered = false
        // Standard text input
        if (ch && ch.length === 1) {
            const line = this.buffer[this.cursor.row]
            this.buffer[this.cursor.row] =
            line.slice(0, this.cursor.col) + ch + line.slice(this.cursor.col)
            this.cursor.col++
            this.render()
        }
    }

    handleBackspace() {
        const { row, col } = this.cursor
        // Line head & first line → Do nothing
        if (row === 0 && col === 0) return
        // Line break → Merge with previous line
        if (col === 0) {
            const prevLine = this.buffer[row - 1]
            const currentLine = this.buffer[row]
            // Merge with the previous line
            this.buffer[row - 1] = prevLine + currentLine
            // Delete the current line
            this.buffer.splice(row, 1)
            // Cursor movement
            this.cursor.row--
            this.cursor.col = prevLine.length
            this.render()
            return
        }
        // Mid-line → Delete the leftmost character
        const line = this.buffer[row]
        this.buffer[row] =line.slice(0, col - 1) + line.slice(col)
        this.cursor.col--
        this.render()
    }

    handleEnter() {
        this.justEntered = false
        const { row, col } = this.cursor
        const line = this.buffer[row]
        // Split line
        const left = line.slice(0, col)
        const right = line.slice(col)
        // Replace the current line with left
        this.buffer[row] = left
        // Insert "right" on the next line
        this.buffer.splice(row + 1, 0, right)
        // Cursor movement
        this.cursor.row++
        this.cursor.col = 0
        this.render()
        this.screen.program.move(this.cursor.col + 1, this.cursor.row + 1)
        this.justEntered = true
    }
}
