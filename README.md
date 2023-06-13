# Angular Bootstrap Template

Template for Angular with Bootstrap using a **sticky header** and **fixed footer**, based on the [sticky-footer-navbar](https://getbootstrap.com/docs/5.0/examples/sticky-footer-navbar/) template of bootstrap. Also checks the `height` of both components and updates the `main`-container (`<rooter-outlet>` part) to pass between them.

## How to?

Create a new angular project

```console
ng new my-angular-bootstrap-app && cd $_
```

Add bootstrap to project.

```console
npm install bootstrap
```

`import` bootstrap into [styles.scss](src/styles.scss) and set css-variables (*more about them later*)

```scss
@import "bootstrap/scss/bootstrap.scss";

:root {
  --header-height: 56px;
  --footer-height: 56px;
}
```

`import` bootstrap.bundle on top of [main.ts](src/main.ts)

```typescript
import 'bootstrap/dist/js/bootstrap.bundle';

// ...
```

add `allowedCommonJsDependencies` with `bootstrap` to the `build` part of [angular.json](angular.json) 

```json
{
  // ...
  "projects": {
    // ...
    "angular-bootstrap-template": {
      // ...
      "architect": {
        // ...
        "build": {
            // ...
            "allowedCommonJsDependencies": [
              "bootstrap"
            ],
            // ...
          },
          // ...
      }
    }
  }
}    
```

Add css-classes to [index.html](src/index.html)

```html
<!doctype html>
<html lang="en" class="h-100"> <!-- "h-100" to html -->
<head></head>
<body class="h-100"> <!-- "h-100" to body -->
  <app-root class="d-flex flex-column h-100"></app-root>
  <!-- "d-flex flex-column h-100" to app-root -->
</body>
</html>
```

Create an abstract base component ([computed-size.component.ts](src/app/util/computed-size.component.ts)) for logic to update `--header-height` and `--footer-height` css variables dynamically.

```typescript
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
```

Add [**header**](src/app/header/header.component.html) and [**footer**](src/app/footer/footer.component.html) components.

```console
ng g c header
ng g c footer
```

Extend [header.component.ts](src/app/header/header.component.ts) and [footer.component.ts](src/app/footer/footer.component.ts) from `ComputedSizeComponent`.

```typescript
// ...

export class HeaderComponent extends ComputedSizeComponent {
  protected override get refName(): string {
    return 'header';
  }

  // ...
}
```

```typescript
// ...

export class FooterComponent extends ComputedSizeComponent {
  protected override get refName(): string {
    return 'footer';
  }

  // ...
}
```

Add `#ref` ([`ElementRef`](https://angular.io/api/core/ElementRef)) to an html-element from which the **height** (*and width*) should be calculated.

```html
<header>
  <nav #ref class="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
    <!-- ... --->
  </nav>
</header>
```

```html
<footer #ref class="footer mt-auto py-3 bg-light fixed-bottom">
  <!-- ... -->
</footer>
```

Set up the html inside of [app.component](src/app/app.component.html)

```html
<app-header></app-header>

<main class="flex-shrink-0">
  <div class="container">
    <router-outlet></router-outlet>
  </div>
</main>

<app-footer></app-footer>
```

Update the styling rules of [app.component](src/app/app.component.scss)

```css
main > .container {
  padding-top: var(--header-height);
  padding-bottom: var(--footer-height);
}
```

The `main > .container` will now always fit between header and footer when the window resizes. When the **height** of footer or header will change otherwise, you can call the `updateStyles()` method of the [computed-size.component](src/app/util/computed-size.component.ts) when needed.

---

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.1.4.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
