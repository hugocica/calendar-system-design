/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  Text,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { InfoIcon, ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { addDays, formatDate, subtractDays } from "../utils/date";

export default function Calendar() {
  const [status, setStatus] = useState<
    "idle" | "pending" | "success" | "error"
  >("idle");
  const [currentDate, setCurrentDate] = useState<Date>(new Date("2024-07-08"));
  const [availableHours, setAvailableHours] = useState<string[]>([]);
  const [blockedHours, setBlockedHours] = useState<string[]>([]);

  const toast = useToast();

  const fetchAvailableHours = useCallback(async (date: Date) => {
    setStatus("pending");

    try {
      const response = await fetch(
        `/api/available-hours?date=${formatDate(date)}`
      );

      if (response.status === 204) {
        setStatus("success");
        setAvailableHours([]);
        return;
      }

      const data = await response.json();

      setStatus("success");
      setAvailableHours(data);
    } catch (error) {
      setStatus("error");
      console.error(error);
    }
  }, []);

  const schedule = async (hour: string) => {
    const body: any = {
      date: `${formatDate(currentDate)} ${hour}`,
    };
    const response = await fetch("/api/schedule", {
      method: "POST",
      body,
    });

    const data = await response.json();

    if (response.status === 404) {
      setBlockedHours((prev) => [...prev, hour]);
      toast({
        description: data.message,
        status: "error",
        duration: 5000,
      });
    } else {
      toast({
        description: "Horário agendado",
        status: "success",
        duration: 5000,
      });
    }
  };

  useEffect(() => {
    fetchAvailableHours(currentDate);
  }, [fetchAvailableHours, currentDate]);

  const Header = () => {
    return (
      <Box alignItems="center" display="flex" gap={5} marginBottom={5}>
        <IconButton
          colorScheme="teal"
          aria-label="Search database"
          icon={<ChevronLeftIcon fontSize={28} />}
          onClick={() => setCurrentDate((prev) => subtractDays(prev, 1))}
        />
        <Text>{formatDate(new Date(currentDate), "PPP")}</Text>
        <IconButton
          colorScheme="teal"
          aria-label="Search database"
          icon={<ChevronRightIcon fontSize={28} />}
          onClick={() => {
            setCurrentDate((prev) => addDays(prev, 1));
          }}
        />
      </Box>
    );
  };

  if (status === "success" && availableHours.length === 0) {
    return (
      <Box
        padding={10}
        alignItems="center"
        display="flex"
        flexDirection="column"
      >
        <Header />
        <Text>Não existem horários disponíveis.</Text>
      </Box>
    );
  }

  return (
    <Box padding={10} alignItems="center" display="flex" flexDirection="column">
      <Header />

      <List spacing={3} width={1000}>
        {availableHours.map((hour) => {
          const isBlockedHour = hour.indexOf("10") > -1;
          const colorScheme = isBlockedHour ? "orange" : "teal";

          return (
            <ListItem key={hour}>
              <Button
                width={1000}
                colorScheme={colorScheme}
                justifyContent={isBlockedHour ? "space-between" : "flex-start"}
                onClick={() => schedule(hour)}
                disabled={blockedHours.includes(hour)}
              >
                {hour}
                {isBlockedHour ? (
                  <Tooltip label="Horário bloqueado para simular quando um horário foi agendado após carregar a listagem">
                    <InfoIcon />
                  </Tooltip>
                ) : null}
              </Button>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
}
