export class PlaceNode {
  constructor(
    public id_place: string,
    public title_place: string,
    public description_place: string,
    public imageUrl: string,
    public price: number,
    public availableFrom: Date,
    public availableTo: Date,
    public userId: string
  ) {}
}
