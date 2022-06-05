import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { PagedData } from 'src/models/paged-data.model';
import { Pokemon } from 'src/models/pokemon.model';
import { PokemonService } from 'src/services/pokemon.service';



@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.scss']
})
export class PokemonListComponent implements OnInit {

  pokemons ?: PagedData<Pokemon>;
  //pokemonId ?: number;

  @Output() messageEvent = new EventEmitter();

  constructor(private pokemonService: PokemonService) { }

  search(term: string) {
    console.log(term);
    if (term == "") {
      this.getPokemons();
    } else {
      this.getPokemonBySearch(term);
    }
  }

  getPokemonBySearch(term : string) {
    this.pokemonService.getPokemonBySearch(term).subscribe(
      results => {
        if (this.pokemons) {
          //this.pokemons.data = [];
          this.pokemons.data = results.data;
        }

      }
    );

  }

  getPokemonDetails(id : number) {
    console.log("emit");
    this.messageEvent.emit(String(id));
  }

  onScroll() {
    const pokemonLimit = 10;
    const pokemonOffset = Number(this.pokemons?.data.length);
    this.pokemonService.getPokemons(pokemonOffset,pokemonLimit).subscribe(
      results => {
        if (this.pokemons) {
          this.pokemons.data = this.pokemons.data.concat(results.data);
        }

      }
    );
  }

  getPokemons() {
    this.pokemonService.getPokemons(0,20).subscribe(results => this.pokemons = results);
  }

  ngOnInit(): void {
    this.getPokemons()
  }

}

