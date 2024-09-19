import React from 'react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

export default function Hover({ status }) {
    const getContent = () => {
        switch (status) {
            case "Autorizado":
                return (
                    <div>
                        <h3>Validade:</h3>
                        <p>20/10/2024</p>
                    </div>
                );
            case "Pendente":
                return (
                    <div>
                        <h3>Pendencia:</h3>
                        <p>Laudo justificando a repetição</p>
                    </div>
                );
            case "Negado":
                return (
                    <div>
                        <h3>Motivo:</h3>
                        <p>Sem cobertura contratual</p>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <HoverCard>
            <HoverCardTrigger>
                <span className='cursor-pointer'>Mais Detalhes</span>
            </HoverCardTrigger>
            
            <HoverCardContent>
                {getContent()}
            </HoverCardContent>
        </HoverCard>
    );
}
