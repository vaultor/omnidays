import { App, Modal } from "obsidian"

export class OmnidaysModal extends Modal {
  constructor(app: App) {
    super(app)
  }

  onOpen() {
    let { contentEl } = this
    contentEl.setText("Woah!")
  }

  onClose() {
    const { contentEl } = this
    contentEl.empty()
  }
}
