library(tidyverse)

dat0 <- read_xlsx("/home/alec/Projects/Brookings/digitalization/build/data/Summary Data_RevisedOct1.xlsx", sheet="Demography", range="A4:O26")
occs <- read_xlsx("/home/alec/Projects/Brookings/digitalization/build/data/Summary Data_RevisedOct1.xlsx", sheet="Occupation groups", range="A2:J24")
occs$`Occupation groups` <- sub(" Occupations", "", occs$`Occupation groups`)

m0 <- merge(occs, dat0[c(-2:-3)], by="Occupation groups")
names(m0) <- sub("__1", "", names(m0))

gg <- ggplot(m0)

gg + geom_hline(yintercept=c(33,60), colour="#ffffff") +
  geom_vline(xintercept=c(50), colour="#ffffff") +
  geom_point(aes(x=Women, y=`Digital score, 2016`, size=`Mean annual wage, 2016`, colour=`Mean annual wage, 2016`), alpha=0.8) + 
  geom_text(aes(x=Women, y=`Digital score, 2016`, label=`Occupation groups`), size=3) +
  scale_size_area(max_size=24) + 
  ggtitle("Digital score versus. share of workers in an occupation who are women, 2016") +
  theme(text=element_text(family="Liberation Sans", color="#111111", size=12, hjust=0.5),
        plot.title = element_text(size=24, family="Liberation Serif"),
        plot.subtitle = element_text(color="#111111", size=18, hjust=0.25),
        legend.position="right",
        panel.grid.major=element_blank(),
        panel.grid.minor=element_blank())
ggsave("~/Projects/Brookings/digitalization/build/sketch1.pdf", width=15, height=8.5)

gg + geom_hline(yintercept=c(33,60), colour="#ffffff") +
  geom_vline(xintercept=c(seq(50,80,10)), colour="#ffffff") +
  geom_point(aes(x=White, y=`Digital score, 2016`, size=`Mean annual wage, 2016`, colour=`Mean annual wage, 2016`), alpha=0.8) + 
  geom_text(aes(x=White, y=`Digital score, 2016`, label=`Occupation groups`), size=3) +
  scale_size_area(max_size=24) + 
  ggtitle("Digital score versus share of workers in an occupation who are white, 2016") +
  theme(text=element_text(family="Liberation Sans", color="#111111", size=12, hjust=0.5),
        plot.title = element_text(size=24, family="Liberation Serif"),
        plot.subtitle = element_text(color="#111111", size=18, hjust=0.25),
        legend.position="right",
        panel.grid.major=element_blank(),
        panel.grid.minor=element_blank())
ggsave("~/Projects/Brookings/digitalization/build/sketch2.pdf", width=15, height=8.5)


dat1 <- dat0 %>% select(c(1:3, 10:15)) 


gender <- dat1 %>% gather(gender, val, Women:Men)
race <- dat1 %>% gather(race, val, White:Latino)

head(dat)
table(dat$high02)
s <- dat$high16 + dat$medium16 + dat$low16
unique(s)

dat2 <- dat %>% mutate(dsl02=(3*high02)+(2*medium02)+(low02), dsl16=(3*high16)+(2*medium16)+(low16))  

dat2$`Digital Skill level_2002`-dat2$dsl02
