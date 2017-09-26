import { SpringApiAppPage } from './app.po';

describe('spring-api-app App', () => {
  let page: SpringApiAppPage;

  beforeEach(() => {
    page = new SpringApiAppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
