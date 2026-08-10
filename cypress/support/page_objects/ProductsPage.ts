export class ProductsPage {
  private searchInput = "#search_product";
  private searchButton = "#submit_search";
  private productsTitle = "h2.title.text-center";
  private productCards = ".productinfo";
  private productNames = ".productinfo p";
  private cartModal = "#cartModal";

  visit(): void {
    cy.visit("/products");
  }

  search(term: string): void {
    cy.get(this.searchInput)
      .clear()
      .type(term);

    cy.get(this.searchButton)
      .click();
  }

  searchWithoutTerm(): void {
    cy.get(this.searchButton)
      .click();
  }

  searchOnlySpaces(): void {
    cy.get(this.searchInput)
      .type("   ");

    cy.get(this.searchButton)
      .click();
  }

  validateSearchedProductsTitle(): void {
    cy.get(this.productsTitle)
      .should("be.visible")
      .and("contain.text", "Searched Products");
  }

  validateProductIsDisplayed(productName: string): void {
    cy.get(this.productNames)
      .should("contain.text", productName);
  }

  validateNoProductsReturned(): void {
    cy.get(this.productCards)
      .should("not.exist");
  }

  validateProductsAreDisplayed(): void {
    cy.get(this.productCards)
      .should("exist")
      .and("have.length.greaterThan", 0);
  }

  validateProductsMatchSearch(term: string): void {
    cy.get(this.productNames).each(($product) => {
      const productName = $product.text().trim().toLowerCase();

      expect(productName)
        .to.include(term.toLowerCase());
    });
  }

  addProductToCartById(
    productName: string,
    productId: number
  ): void {
    cy.contains(".productinfo p", productName)
      .parents(".productinfo")
      .find(`[data-product-id="${productId}"]`)
      .click();
  }

  validateProductAdded(): void {
    cy.get(this.cartModal)
      .should("be.visible")
      .and("contain.text", "Added!")
      .and("contain.text", "Your product has been added to cart.");
  }

  goToCart(): void {
    cy.get(this.cartModal)
      .find('a[href="/view_cart"]')
      .should("be.visible")
      .click();
  }

  continueShopping(): void {
    cy.get(this.cartModal)
      .contains("button", "Continue Shopping")
      .should("be.visible")
      .click();
  }
}

export const productsPage = new ProductsPage();