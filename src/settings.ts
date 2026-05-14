import { App, PluginSettingTab, Setting } from "obsidian"
import Omnidays from "./main"

export interface OmnidaysSettings {
  mySetting: string
}

export const DEFAULT_SETTINGS: OmnidaysSettings = {
  mySetting: "default",
}

export class OmnidaysSettingTab extends PluginSettingTab {
  plugin: Omnidays

  constructor(app: App, plugin: Omnidays) {
    super(app, plugin)
    this.plugin = plugin
  }

  display(): void {
    const { containerEl } = this

    containerEl.empty()

    new Setting(containerEl)
      .setName("Settings #1")
      .setDesc("It's a secret")
      .addText((text) =>
        text
          .setPlaceholder("Enter your secret")
          .setValue(this.plugin.settings.mySetting)
          .onChange(async (value) => {
            this.plugin.settings.mySetting = value
            await this.plugin.saveSettings()
          }),
      )
  }
}
