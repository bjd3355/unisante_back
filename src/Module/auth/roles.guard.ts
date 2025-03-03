import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true; // Si aucun rôle n'est spécifié, tout le monde peut accéder à la route
    }
    
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Vérifie si l'utilisateur a un rôle valide
    return roles.some(role => user.role === role);
  }
}
