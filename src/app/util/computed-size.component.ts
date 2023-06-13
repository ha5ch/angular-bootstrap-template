import { AfterViewInit, Component, ElementRef, OnDestroy, Renderer2, ViewChild } from "@angular/core";

interface Size {
  height: string;
  width: string;
}

@Component({ template: '<div #ref></div>' })
export abstract class ComputedSizeComponent implements AfterViewInit, OnDestroy {
  @ViewChild('ref') ref!: ElementRef<HTMLElement>;
  private root: HTMLElement;
  private rootStyle: CSSStyleDeclaration;
  private resizeListener = () => { };

  constructor(protected renderer: Renderer2) {
    this.updateStyles = this.updateStyles.bind(this)

    this.root = document.querySelector(':root')!;
    this.rootStyle = getComputedStyle(this.root);
  }

  ngAfterViewInit(): void {
    if (!this.ref) { throw Error(`missing ref on ${this.refName}`); }
    this.resizeListener = this.renderer.listen('window', 'resize', this.updateStyles);
    this.updateStyles();
  }

  ngOnDestroy(): void {
    this.resizeListener();
  }

  protected abstract get refName(): string;

  private get heightProperty() {
    return `--${this.refName}-height`;
  }

  private get widthProperty() {
    return `--${this.refName}-width`;
  }

  private get clientHeight() {
    return this.ref.nativeElement.clientHeight + 'px';
  }

  private get clientWidth() {
    return this.ref.nativeElement.clientWidth + 'px';
  }

  private get currentSize(): Size {
    return {
      height: this.rootStyle.getPropertyValue(this.heightProperty),
      width: this.rootStyle.getPropertyValue(this.widthProperty)
    }
  }

  protected updateStyles() {
    const { height, width } = this.currentSize;
    const { clientHeight, clientWidth } = this;

    if (clientHeight !== height) { this.root.style.setProperty(this.heightProperty, clientHeight); }
    if (clientWidth !== width) { this.root.style.setProperty(this.widthProperty, clientWidth); }
  }
}
