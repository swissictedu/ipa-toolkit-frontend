import { generatePathHierarchy } from './url';

it('generates path hierarchy', () => {
  const testString = '/segment1/segment2/segment3';
  expect(generatePathHierarchy(testString)).toStrictEqual(['/segment1', '/segment1/segment2', '/segment1/segment2/segment3']);
});
