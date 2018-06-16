/* eslint-disable no-undef */
import React from 'react';
import renderer from 'react-test-renderer';

import Footer from '../../../src/components/footer';

const wrapper = mount(<Footer />);
describe('The Footer Component', () => {
  it('should render correctly', () => {
    const tree = renderer.create(<Footer />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render and have a footer element', () => {
    expect(wrapper.find('footer').length).toBe(1);
  });

  it('should have an unordered list element', () => {
    expect(wrapper.find('ul').length).toBe(1);
  });

  it('should have four list item child elements', () => {
    expect(wrapper.find('ul').children().length).toBe(4);
  });

  it('should have li elements containing a span element each', () => {
    expect(wrapper.find('li').first().find('span').length).toBe(1);
  });

  it('should have a copyright footer text at the bottom', () => {
    expect(wrapper.find('.container').text())
      .toBe('© Andela 2018Created by Kayode Adeola');
  });
});
