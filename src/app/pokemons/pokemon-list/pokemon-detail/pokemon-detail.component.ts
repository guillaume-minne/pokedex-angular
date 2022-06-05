import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Pokemon } from 'src/models/pokemon.model';
import { PokemonService } from 'src/services/pokemon.service';

@Component({
  selector: 'app-pokemon-detail',
  templateUrl: './pokemon-detail.component.html',
  styleUrls: ['./pokemon-detail.component.scss']
})
export class PokemonDetailComponent implements OnInit {
  pokemon ?: Pokemon;
  @Input() pokemonIdDetail ?: number;

  constructor(private pokemonService: PokemonService) { }

  ngOnChanges() {
    console.log("detail:"+this.pokemonIdDetail)
    if (this.pokemonIdDetail)
      this.getPokemon(this.pokemonIdDetail);
  }

  audioPlay() {
    let audio = new Audio();
    audio.src = `assets/audio/${this.pokemon?.id}.mp3`;
    audio.load();
    audio.play();
  }

  getPokemon(id : number) {
    //const id = Number(this.route.snapshot.paramMap.get('id'));
    this.pokemonService.getPokemon(id).subscribe(result => this.pokemon = result);
    //this.heroService.getHero(id).subscribe(res => this.hero = res);
  }

  ngOnInit(): void {
    //this.getPokemon(1);
    //this.getPokemon();
    //this.audioPlay();

  }

}


/*

export class HeroDetailComponent implements OnInit {

  save() {
    if (this.hero) {
      this.heroService.updateHero(this.hero).subscribe(_ => this.goBack());
    }
  }

  goBack() {
    this.location.back();
  }

  getHero() {
    //this.heroService.getHeroes().subscribe(results => this.heroes = results)
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.heroService.getHero(id).subscribe(res => this.hero = res);
  }

  constructor(private route: ActivatedRoute,private heroService: HeroService, private location:Location ) {}


}


*/
