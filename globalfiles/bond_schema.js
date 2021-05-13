function CreateGreenBond(
    _BondId = 10000,
    _BondProp1 = '',
    _BondProp2 = '',
    _BondProp3 = '',
    _BondProp4 = '',
    _BondProp5 = ''

)
{
    const bondJSON = {}
    bondJSON.BondId = _BondId;
    bondJSON.BondProp1 = _BondProp1;
    bondJSON.BondProp2 = _BondProp2;
    bondJSON.BondProp3 = _BondProp3;
    bondJSON.BondProp4 = _BondProp4;
    bondJSON.BondProp5 = _BondProp5;
    return JSON.parse(JSON.stringify(bondJSON));
}