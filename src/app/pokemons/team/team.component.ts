import { Token } from '@angular/compiler';
import { Component, Input, OnInit } from '@angular/core';
import { forkJoin, Observable, of, switchMap, tap } from 'rxjs';
import { PagedData } from 'src/models/paged-data.model';
import { Pokemon } from 'src/models/pokemon.model';
import { Tokens } from 'src/models/tokens.model';
import { PokemonService } from 'src/services/pokemon.service';


@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent implements OnInit {
  pokemons ?: Pokemon[];
  @Input() selectedPokemonId ?: number;
  tokens ?: Tokens;
  mail : string = "guillaume.minne@ig2i.centralelille.fr";
  passw : string = "bdhpres";

  constructor(private pokemonService: PokemonService) { }

  login(mail: string, passw: string) {
      return this.pokemonService.login(mail,passw).pipe(
        tap(results => /*this.token = results*/ console.log(results) )
      );
  }

  getPokemon(id : number) {
    return this.pokemonService.getPokemon(id).pipe(
      tap(result => console.log("getPokemon:"+result))
    );
  }

  getTeam(accessToken: string) {
    console.log("token"+accessToken)
    if (accessToken) {
      return this.pokemonService.getTeam(accessToken).pipe(
        tap(results => console.log("getTeam:"+results) )
      )
    }
    return of();
  }

  setTeam(accessToken: string, pokemonIds: number[]) {
    return this.pokemonService.setTeam(accessToken,pokemonIds).pipe(
      tap(() => console.log("setTeam:"+pokemonIds))
    );
  }

  addPokemon(index: number) {
    console.log(index)
    console.log(this.selectedPokemonId)

    if (this.pokemons && this.selectedPokemonId) {
      let idsCut = this.pokemons?.map(({id})=>id);
      idsCut[index] = this.selectedPokemonId;

      for (let i=0; i<6; i++) {
        if (idsCut[i] == 0 ) {
          idsCut.splice(i,1);
          i--;
        }
      }

      this.login(this.mail,this.passw).pipe(
        switchMap(token => {
          this.tokens = token;
          return this.setTeam(token.access_token,idsCut);
        }),
        switchMap(() => {
          return this.getPokemonsFromIds(idsCut);
        }),
        switchMap(pkmnResults => {
          return of(this.fillEmptyPokemons(pkmnResults));
        } )
      ).subscribe(results => { console.log(results); this.pokemons = results;});


    }
  }

  removePokemon(index: number) {
    if (this.pokemons) {
      let idsCut = this.pokemons?.map(({id})=>id);
      idsCut?.splice(index,1);

      for (let i=0; i<6; i++) {
        if (idsCut[i] == 0 ) {
          idsCut.splice(i,1);
          i--;
        }
      }

      this.login(this.mail,this.passw).pipe(
        switchMap(token => {
          this.tokens = token;
          return this.setTeam(token.access_token,idsCut);
        }),
        switchMap(() => {
          return this.getPokemonsFromIds(idsCut);
        }),
        switchMap(pkmnResults => {
          return of(this.fillEmptyPokemons(pkmnResults));
        } )
      ).subscribe(results => { console.log(results); this.pokemons = results;});

    }
  }

  getPokemonsFromIds(ids: number[]) {
    let obsPokemon: Observable<Pokemon>[] = [];

    let long = ids.length;
    if (long > 6) {
      long = 6;
    }

    for (let i=0; i<long; i++) {
      console.log(ids[i]);
      let pokemon = this.getPokemon(ids[i]);
      obsPokemon.push(pokemon);
    }

    return forkJoin(obsPokemon);
  }

  fillEmptyPokemons(pokemons: Pokemon[]) {
    while (pokemons.length < 6) {
      let pokemonEmpty = {
        id: 0,
        name: "[Vide]",
        description: "",
        height: 0,
        weight: 0,
        types: []
      }
      pokemons.push(pokemonEmpty);
    }
    return (pokemons);
  }

  ngOnInit(): void {

    this.login(this.mail,this.passw).pipe(
      switchMap(token => {
        this.tokens = token;
        return this.getTeam(token.access_token);
      }),
      switchMap((ids: number[]) => {
        return this.getPokemonsFromIds(ids);
      }),
      switchMap(pkmnResults => {
        return of(this.fillEmptyPokemons(pkmnResults));
      } )
    ).subscribe(results => { console.log(results); this.pokemons = results;});


  }

}
