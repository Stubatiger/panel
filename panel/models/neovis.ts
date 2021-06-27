import * as p from "@bokehjs/core/properties"
import {HTMLBox, HTMLBoxView} from "@bokehjs/models/layouts/html_box"
import {div} from "@bokehjs/core/dom";


function ID() {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return '_' + Math.random().toString(36).substr(2, 9);
}

export class NeoVisView extends HTMLBoxView {
  model: NeoVis
  protected _neovis: any
  protected _container: HTMLDivElement
  protected _chart: any
  protected _div_id: any

  initialize(): void {

    super.initialize()
    this._neovis = (window as any).NeoVis

    this._div_id = ID()
    this._container = div({
      id: this._div_id,
      style: {
        width: "100%",
        height: "100%",
        zIndex: 0,
      }
    })
  }

  connect_signals(): void {
    super.connect_signals()
    this.connect(this.model.properties.config.change, () => this._plot())
    this.connect(this.model.properties.action.change, () => this._neovis_action_cb())
    this.connect(this.model.properties.query.change, () => this._render_with_cypher())
  }

  render(): void {
    super.render()

    if (!(this._container === this.el.childNodes[0])){
      this.el.appendChild(this._container)
      this._chart = new this._neovis.default({
                container_id: this._div_id,
                ...this.model.config
            })
    }

    this._plot()
  }

  after_layout(): void {
    super.after_layout()
  }

  _plot(): void {
    this._chart.render()
  }

  _neovis_action_cb(): void {
    switch(this.model.action) {
       case "clear": {
          this._clearNetwork()
          break;
       }
       case "reload": {
          this._reload()
          break;
       }
       case "stabilize": {
          this._stabilize()
          break;
       }
       default: {
          //statements;
          break;
       }
    }
  }

  _clearNetwork(): void {
    this._chart.clearNetwork()
  }

  _reinit(): void {
    this._chart.reinit(this.model.config)
  }

  _reload(): void {
    this._chart.reload()
  }

  _stabilize(): void {
    this._chart.stabilize()
  }

  _render_with_cypher(): void {
    this._chart.renderWithCypher(this.model.query)
  }

}

export namespace NeoVis {
  export type Attrs = p.AttrsOf<Props>
  export type Props = HTMLBox.Props & {
    config: p.Property<any>
    action: p.Property<string>
    query: p.Property<string>
  }
}

export interface NeoVis extends NeoVis.Attrs {}

export class NeoVis extends HTMLBox {
  properties: NeoVis.Props

  constructor(attrs?: Partial<NeoVis.Attrs>) {
    super(attrs)
  }

  static __module__ = "panel.models.neovis"

  static init_NeoVis(): void {
    this.prototype.default_view = NeoVisView

    this.define<NeoVis.Props>(({Any, String}) => ({
      config:     [ Any, {} ],
      action: [String, ""],
      query: [String, ""]
    }))
  }
}