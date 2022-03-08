import UnitConverter from '../UnitConverter';
describe('UnitConverter', () =>
{
    let uc = new UnitConverter()

    test('Converting meters to feet', () => {
        expect(uc.metersToFeet(1)).toBe(3.2808);
    });

    test('Converting feet to meters', () => {
        expect(uc.feetToMeters(1)).toBe(0.3048);
    });
});