import { Injectable, MessageEvent } from '@nestjs/common';
import { Permission } from '../../common/enums/permission.enum';
import { StatusIrregularidade } from '../../common/enums/status-irregularidade.enum';
import {
  collectUserPermissions,
  getReadPermissionForStatus,
} from '../../common/utils/irregularidade-permissions.util';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { Observable, Subject, interval, merge } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import {
  IrregularidadeFluxoChangedEvent,
  IrregularidadeFluxoStreamEvent,
  IrregularidadeVistoriaFinalizadaEvent,
} from './irregularidade-fluxo-events.types';

const HEARTBEAT_INTERVAL_MS = 5_000;

@Injectable()
export class IrregularidadeFluxoEventsService {
  private readonly subject = new Subject<IrregularidadeFluxoStreamEvent>();

  emitStatusChange(payload: {
    irregularidadeId: string;
    statusAnterior: StatusIrregularidade;
    statusNovo: StatusIrregularidade;
    idEmpresaManutencao?: string;
  }): void {
    const event: IrregularidadeFluxoChangedEvent = {
      type: 'FLUXO_CHANGED',
      irregularidadeId: payload.irregularidadeId,
      statusAnterior: payload.statusAnterior,
      statusNovo: payload.statusNovo,
      idEmpresaManutencao: payload.idEmpresaManutencao,
    };
    this.subject.next(event);
  }

  emitVistoriaFinalizada(
    vistoriaId: string,
    irregularidadeIds: string[],
  ): void {
    if (irregularidadeIds.length === 0) {
      return;
    }
    const event: IrregularidadeVistoriaFinalizadaEvent = {
      type: 'VISTORIA_FINALIZADA',
      vistoriaId,
      irregularidadeIds,
    };
    this.subject.next(event);
  }

  streamForUser(user: Usuario): Observable<MessageEvent> {
    const permissions = collectUserPermissions(user.perfis);

    const events$ = this.subject.pipe(
      filter((event) => this.userCanReceive(user, permissions, event)),
      map((event) => ({ data: event })),
    );

    const heartbeat$ = interval(HEARTBEAT_INTERVAL_MS).pipe(
      map(() => ({
        data: { type: 'HEARTBEAT' } satisfies IrregularidadeFluxoStreamEvent,
      })),
    );

    return merge(events$, heartbeat$);
  }

  private userCanReceive(
    user: Usuario,
    permissions: Set<string>,
    event: IrregularidadeFluxoStreamEvent,
  ): boolean {
    if (event.type === 'HEARTBEAT') {
      return true;
    }

    if (event.type === 'VISTORIA_FINALIZADA') {
      return permissions.has(
        Permission.IRREGULARIDADE_TRATAMENTO_READ.toLowerCase(),
      );
    }

    const statuses = [event.statusAnterior, event.statusNovo];
    for (const status of statuses) {
      const required = getReadPermissionForStatus(status);
      if (!permissions.has(required.toLowerCase())) {
        continue;
      }
      if (
        status === StatusIrregularidade.EM_MANUTENCAO &&
        user.idEmpresa &&
        event.idEmpresaManutencao &&
        event.idEmpresaManutencao !== user.idEmpresa
      ) {
        continue;
      }
      return true;
    }

    return false;
  }
}
