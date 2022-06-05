import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { PagedData } from 'src/models/paged-data.model';
import { Pokemon } from 'src/models/pokemon.model';
import { Tokens } from 'src/models/tokens.model';


@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  private pokemonUrl = 'http://app-ec21e68e-3e55-42d7-b1ae-3eef7507a353.cleverapps.io';

  /*
  getPokemons(): Observable<PagedData<Pokemon>> {
    return this.http.get<PagedData<Pokemon>>(this.pokemonUrl+"/pokemons").pipe(
      tap(() => this.log("getPokemons"))
    );
  }
  */

  getPokemons(offset: number, limit: number): Observable<PagedData<Pokemon>> {
    return this.http.get<PagedData<Pokemon>>(this.pokemonUrl+`/pokemons?offset=${offset}&limit=${limit}`).pipe(
      tap(() => this.log(`getPokemons?offset=${offset}&limit=${limit}`))
    );
  }

  getPokemon(id: number): Observable<Pokemon> {
    return this.http.get<Pokemon>(this.pokemonUrl+`/pokemons/${id}`).pipe(
      tap(() => this.log(`getPokemon=${id}`))
    );
  }

  getPokemonBySearch(term: string): Observable<PagedData<Pokemon>> {
    return this.http.get<PagedData<Pokemon>>(this.pokemonUrl+`/pokemons?search=${term}`).pipe(
      tap(() => this.log(`getPokemonBySearch=${term}`))
    );
  }

  login(mail: string, passw: string) {
    return this.http.post<Tokens>(this.pokemonUrl+"/auth/login", {email:mail, password:passw}).pipe(
      tap(() => this.log(`login?email=${mail}&password=${passw}`))
    );

  }

  getTeam(accessToken: string) {
    var header = {
      headers: new HttpHeaders().set('Authorization',  `Bearer ${accessToken}`)
    }
    return this.http.get<number[]>(this.pokemonUrl+`/trainers/me/team`,header).pipe(
      tap(() => this.log(`getTeam()`))
    );
  }

  setTeam(accessToken: string, pokemonIds: number[]) {
    /*var header = {
      headers: new HttpHeaders().set('Authorization',  `Bearer ${accessToken}`)
    }*/
    var body = pokemonIds;

    var header = {
      headers : new HttpHeaders({ "Content-Type": "application/json", "Accept": "/", "Authorization": `Bearer ${accessToken}`})
    };

    return this.http.put<any>(this.pokemonUrl+`/trainers/me/team`,body,header).pipe(
      tap(() => this.log(`setTeam()`))
    )
  }

  private log(message: string): void {
    console.log(`PokemonService: ${message}`)
  }

  constructor(private http: HttpClient) { }
}
