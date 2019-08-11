import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sort',
  pure: false,
})

export class PlayersSortPipe implements PipeTransform {
  transform(array: any): any[] {
    if (!Array.isArray(array)) {
      return;
    }


    const goalie = array.filter(player => player.role === 'Вратарь');

    let black = array.filter(player => player.color === 'black');
    black = black.sort(({ number: number1 }, { number: number2 }) => {
      return number1 - number2;
    });
    black = [...black.filter(player => player.number), ...black.filter(player => !player.number)];

    let white = array.filter(player => player.color === 'white');
    white = white.sort(({ number: number1 }, { number: number2 }) => {
      return number1 - number2;
    });
    white = [...white.filter(player => player.number), ...white.filter(player => !player.number)];

    const undef = array.filter(player => !player.color && player.role !== 'Вратарь');

    return [...goalie, ...white, ...black, ...undef];
  }
}
