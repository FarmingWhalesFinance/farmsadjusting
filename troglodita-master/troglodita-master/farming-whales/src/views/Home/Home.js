import React, { useMemo } from 'react';
import Page from '../../components/Page';
import { createGlobalStyle } from 'styled-components';
import CountUp from 'react-countup';
import CardIcon from '../../components/CardIcon';
import TokenSymbol from '../../components/TokenSymbol';
import useBombStats from '../../hooks/useBombStats';
import useLpStats from '../../hooks/useLpStats';
import useLpStatsBTC from '../../hooks/useLpStatsBTC';
import useModal from '../../hooks/useModal';
import useZap from '../../hooks/useZap';
import useBondStats from '../../hooks/useBondStats';
import usebShareStats from '../../hooks/usebShareStats';
import useTotalValueLocked from '../../hooks/useTotalValueLocked';
import { Bomb as bombTesting, BShare as bShareTesting } from '../../bomb-finance/deployments/deployments.testing.json';
import { Bomb as bombProd, BShare as bShareProd } from '../../bomb-finance/deployments/deployments.mainnet.json';
import { roundAndFormatNumber } from '../../0x';
import MetamaskFox from '../../assets/img/metamask-fox.svg';
import { Box, Button, Card, CardContent, Grid, Paper } from '@material-ui/core';
import ZapModal from '../Bank/components/ZapModal';
import { Alert } from '@material-ui/lab';

import { makeStyles } from '@material-ui/core/styles';
import useBombFinance from '../../hooks/useBombFinance';
import { ReactComponent as IconTelegram } from '../../assets/img/telegram.svg';
import { Helmet } from 'react-helmet'
import BombImage from '../../assets/img/bomb.png';

import HomeImage from '../../assets/img/background.jpg';
const BackgroundImage = createGlobalStyle`
  body {
    background: url(${HomeImage}) repeat !important;
    background-size: cover !important;
    background-color: #171923;
  }
`;
const TITLE = 'bomb.money | BTC pegged algocoin'

// const BackgroundImage = createGlobalStyle`
//   body {
//     background-color: grey;
//     background-size: cover !important;
//   }
// `;

const useStyles = makeStyles((theme) => ({
  button: {
    [theme.breakpoints.down('415')]: {
      // marginTop: '10px'
    },
  },
}));

const Home = () => {
  const classes = useStyles();
  const TVL = useTotalValueLocked();
  const bombFtmLpStats = useLpStatsBTC('BOMB-BTCB-LP');
  const bShareFtmLpStats = useLpStats('BSHARE-BNB-LP');
  const bombStats = useBombStats();
  const bShareStats = usebShareStats();
  const tBondStats = useBondStats();
  const bombFinance = useBombFinance();

  let bomb;
  let bShare;
  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    bomb = bombTesting;
    bShare = bShareTesting;
  } else {
    bomb = bombProd;
    bShare = bShareProd;
  }

  const buyBombAddress =
    //  'https://pancakeswap.finance/swap?inputCurrency=0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c&outputCurrency=' +
    'https://traderjoexyz.com/trade';
  //https://pancakeswap.finance/swap?outputCurrency=0x531780FAcE85306877D7e1F05d713D1B50a37F7A';
  const buyBShareAddress = 'https://traderjoexyz.com/trade';
  const bombLPStats = useMemo(() => (bombFtmLpStats ? bombFtmLpStats : null), [bombFtmLpStats]);
  const bshareLPStats = useMemo(() => (bShareFtmLpStats ? bShareFtmLpStats : null), [bShareFtmLpStats]);
  const bombPriceInDollars = useMemo(
    () => (bombStats ? Number(bombStats.priceInDollars).toFixed(2) : null),
    [bombStats],
  );
  const bombPriceInBNB = useMemo(() => (bombStats ? Number(bombStats.tokenInFtm).toFixed(4) : null), [bombStats]);
  const bombCirculatingSupply = useMemo(() => (bombStats ? String(bombStats.circulatingSupply) : null), [bombStats]);
  const bombTotalSupply = useMemo(() => (bombStats ? String(bombStats.totalSupply) : null), [bombStats]);

  const bSharePriceInDollars = useMemo(
    () => (bShareStats ? Number(bShareStats.priceInDollars).toFixed(2) : null),
    [bShareStats],
  );
  const bSharePriceInBNB = useMemo(
    () => (bShareStats ? Number(bShareStats.tokenInFtm).toFixed(4) : null),
    [bShareStats],
  );
  const bShareCirculatingSupply = useMemo(
    () => (bShareStats ? String(bShareStats.circulatingSupply) : null),
    [bShareStats],
  );
  const bShareTotalSupply = useMemo(() => (bShareStats ? String(bShareStats.totalSupply) : null), [bShareStats]);

  const tBondPriceInDollars = useMemo(
    () => (tBondStats ? Number(tBondStats.priceInDollars).toFixed(2) : null),
    [tBondStats],
  );
  const tBondPriceInBNB = useMemo(() => (tBondStats ? Number(tBondStats.tokenInFtm).toFixed(4) : null), [tBondStats]);
  const tBondCirculatingSupply = useMemo(
    () => (tBondStats ? String(tBondStats.circulatingSupply) : null),
    [tBondStats],
  );
  const tBondTotalSupply = useMemo(() => (tBondStats ? String(tBondStats.totalSupply) : null), [tBondStats]);

  const bombLpZap = useZap({ depositTokenName: 'BOMB-BTCB-LP' });
  const bshareLpZap = useZap({ depositTokenName: 'BSHARE-BNB-LP' });

  const [onPresentBombZap, onDissmissBombZap] = useModal(
    <ZapModal
      decimals={18}
      onConfirm={(zappingToken, tokenName, amount) => {
        if (Number(amount) <= 0 || isNaN(Number(amount))) return;
        bombLpZap.onZap(zappingToken, tokenName, amount);
        onDissmissBombZap();
      }}
      tokenName={'WHALE-USDC.e LP'}
    />,
  );

  const [onPresentBshareZap, onDissmissBshareZap] = useModal(
    <ZapModal
      decimals={18}
      onConfirm={(zappingToken, tokenName, amount) => {
        if (Number(amount) <= 0 || isNaN(Number(amount))) return;
        bshareLpZap.onZap(zappingToken, tokenName, amount);
        onDissmissBshareZap();
      }}
      tokenName={'BSHARE-BNB-LP'}
    />,
  );

  return (
    <Page>
      <Helmet>
        <title>{TITLE}</title>
      </Helmet>
      <BackgroundImage />
      <Grid container spacing={3}>
        {/* Logo */}
        <Grid
          item
          xs={12}
          sm={4}
          style={{ display: 'flex', justifyContent: 'center', verticalAlign: 'middle', overflow: 'hidden' }}
        >
          <img src={BombImage} alt='Bomb.money' style={{ maxHeight: '240px' }} />
        </Grid>
        {/* Explanation text */}
        <Grid item xs={12} sm={8}>
          <Paper>
            <Box p={4} style={{ textAlign: 'center' }}>
              <h2>FARMING WHALES FINANCE</h2>
              <p>
                $WHALE is an algorithmic token pegged to USDC.e
              </p>
              <p>
                <strong>Introducing the backbone of a rapidly growing ecosystem aimed towards bringing liquidity and new use cases to the Avalanche network.</strong>
                {/* Stake your BOMB-BTC LP in the Farm to earn BSHARE rewards. Then stake your earned BSHARE in the
                Boardroom to earn more BOMB! */}
              </p>
              <p>
                <IconTelegram alt="telegram" style={{ fill: '#dddfee', height: '15px' }} /> Join our{' '}
                <a
                  href="https://t.me"
                  rel="noopener noreferrer"
                  target="_blank"
                  style={{ color: '#dddfee' }}
                >
                  Telegram
                </a>{' '}
                to find out more!
              </p>
            </Box>
          </Paper>
        </Grid>

      {/*   <Grid container spacing={3}>
          <Grid item xs={12} sm={12} justify="center" style={{ margin: '12px', display: 'flex' }}>

            <Alert variant="filled" severity="info">
              <strong>Please Note:</strong> We were not impacted by any of the recent exploits. &nbsp;
              <a rel="noopener noreferrer" href="https://medium.com/@bombbshare/dec-18-quick-update-regarding-grim-exploit-4f1a0c989fba" target="_blank">
                Read more here.
              </a>

            </Alert>

          </Grid>
        </Grid>
 */}
        {/* TVL */}
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent align="center">
              <h2>Total Value Locked</h2>
              <h4>$????</h4>
            </CardContent>
          </Card>
        </Grid>

        {/* Wallet */}
        <Grid item xs={12} sm={8}>
          <Card style={{ height: '100%' }}>
            <CardContent align="center" style={{ marginTop: '2.5%' }}>
              {/* <h2 style={{ marginBottom: '20px' }}>Wallet Balance</h2> */}
              <Button href="/boardroom" className="shinyButton" style={{ margin: '10px' }}>
                Stake Now
              </Button>
              <Button href="/farm" className="shinyButton" style={{ margin: '10px' }}>
                Farm Now
              </Button>
              <Button
                target="_blank"
                href={buyBombAddress}
                style={{ margin: '10px' }}
                className={'shinyButton ' + classes.button}
              >
                Buy WHALE
              </Button>
              <Button
                target="_blank"
                href={buyBShareAddress}
                className={'shinyButton ' + classes.button}
                style={{ marginLeft: '10px' }}
              >
                Buy WHALESHARE
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* BOMB */}
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent align="center" style={{ position: 'relative' }}>
              <Box mt={2}>
                <CardIcon>
                  <TokenSymbol symbol="BOMB" />
                </CardIcon>
              </Box>
              <Button
                onClick={() => {
                  bombFinance.watchAssetInMetamask('BOMB');
                }}
                style={{ position: 'absolute', top: '10px', right: '10px', border: '1px grey solid' }}
              >
                {' '}
                <b>+</b>&nbsp;&nbsp;
                <img alt="metamask fox" style={{ width: '20px', filter: 'grayscale(100%)' }} src={MetamaskFox} />
              </Button>
              <h2 style={{ marginBottom: '10px' }}>WHALEUSD</h2>
          
            
              <Box>
                <span style={{ fontSize: '16px', alignContent: 'flex-start' }}>
                 $???? / WHALE
                </span>
              </Box>
              <span style={{ fontSize: '12px' }}>
                Market Cap: $???? <br />
                Circulating Supply: $????<br />
                Total Supply: $????
              </span>
            </CardContent>
          </Card>
        </Grid>

        {/* BSHARE */}
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent align="center" style={{ position: 'relative' }}>
              <Button
                onClick={() => {
                  bombFinance.watchAssetInMetamask('BSHARE');
                }}
                style={{ position: 'absolute', top: '10px', right: '10px', border: '1px grey solid' }}
              >
                {' '}
                <b>+</b>&nbsp;&nbsp;
                <img alt="metamask fox" style={{ width: '20px', filter: 'grayscale(100%)' }} src={MetamaskFox} />
              </Button>
              <Box mt={2}>
                <CardIcon>
                  <TokenSymbol symbol="BSHARE" />
                </CardIcon>
              </Box>
              <h2 style={{ marginBottom: '10px' }}>WHALESHARE</h2>

              <Box>
                <span style={{ fontSize: '16px' }}>$???? / WHALESHARE</span>
              </Box>
              <span style={{ fontSize: '12px' }}>
                Market Cap: $????
                <br />
                Circulating Supply: ????<br />
                Total Supply: ????
              </span>
            </CardContent>
          </Card>
        </Grid>

        {/* BBOND */}
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent align="center" style={{ position: 'relative' }}>
              <Button
                onClick={() => {
                  bombFinance.watchAssetInMetamask('BBOND');
                }}
                style={{ position: 'absolute', top: '10px', right: '10px', border: '1px grey solid' }}
              >
                {' '}
                <b>+</b>&nbsp;&nbsp;
                <img alt="metamask fox" style={{ width: '20px', filter: 'grayscale(100%)' }} src={MetamaskFox} />
              </Button>
              <Box mt={2}>
                <CardIcon>
                  <TokenSymbol symbol="BBOND" />
                </CardIcon>
              </Box>
              <h2 style={{ marginBottom: '10px' }}>WHALEBOND</h2>
              
             
              <Box>
                <span style={{ fontSize: '16px' }}>$???? / WHALEBOND</span>
              </Box>
              <span style={{ fontSize: '12px' }}>
                Market Cap: $????<br />
                Circulating Supply: ????<br />
                Total Supply: ????
              </span>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent align="center">
              <Box mt={2}>
                <CardIcon>
                  <TokenSymbol symbol="BOMB-BTCB-LP" />
                </CardIcon>
              </Box>
              <h2>WHALE-USDC.e LP</h2>
              <Box mt={2}>
                <Button disabled onClick={onPresentBombZap} className="shinyButtonDisabledSecondary">
                  Zap In
                </Button>
              </Box>
              <Box mt={2}>
                <span style={{ fontSize: '26px' }}>
                  {bombLPStats?.tokenAmount ? bombLPStats?.tokenAmount : '-.--'} WHALE /{' '}
                  {bombLPStats?.ftmAmount ? bombLPStats?.ftmAmount : '-.--'} USDC.e
                </span>
              </Box>
              <Box>${bombLPStats?.priceOfOne ? bombLPStats.priceOfOne : '-.--'}</Box>
              <span style={{ fontSize: '12px' }}>
                Liquidity: ${bombLPStats?.totalLiquidity ? roundAndFormatNumber(bombLPStats.totalLiquidity, 2) : '-.--'}{' '}
                <br />
                Total Supply: {bombLPStats?.totalSupply ? roundAndFormatNumber(bombLPStats.totalSupply, 2) : '-.--'}
              </span>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent align="center">
              <Box mt={2}>
                <CardIcon>
                  <TokenSymbol symbol="BSHARE-BNB-LP" />
                </CardIcon>
              </Box>
              <h2>WHALESHARE-USDC.e LP</h2>
              <Box mt={2}>
                <Button disabled onClick={onPresentBshareZap} className="shinyButtonDisabledSecondary">
                  Zap In
                </Button>
              </Box>
              <Box mt={2}>
                <span style={{ fontSize: '26px' }}>
                  {bshareLPStats?.tokenAmount ? bshareLPStats?.tokenAmount : '-.--'} WHALESHARE /{' '}
                  {bshareLPStats?.ftmAmount ? bshareLPStats?.ftmAmount : '-.--'} USDC.e
                </span>
              </Box>
              <Box>${bshareLPStats?.priceOfOne ? bshareLPStats.priceOfOne : '-.--'}</Box>
              <span style={{ fontSize: '12px' }}>
                Liquidity: $
                {bshareLPStats?.totalLiquidity ? roundAndFormatNumber(bshareLPStats.totalLiquidity, 2) : '-.--'}
                <br />
                Total Supply: {bshareLPStats?.totalSupply ? roundAndFormatNumber(bshareLPStats.totalSupply, 2) : '-.--'}
              </span>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Page>
  );
};

export default Home;
